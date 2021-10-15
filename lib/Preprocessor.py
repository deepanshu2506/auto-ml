from abc import ABC, abstractmethod
from typing import Dict, List
from utils.enums import DataTypes

import numpy as np
from numpy.lib.function_base import select
from db.models.Dataset import Dataset, DatasetFeature
from pandas.core.frame import DataFrame
from sklearn.preprocessing import OrdinalEncoder
from tensorflow.keras.layers.experimental.preprocessing import (
    Normalization,
    StringLookup,
    IntegerLookup,
    CategoryEncoding,
)
import tensorflow as tf
import pandas as pd


class Preprocessor(ABC):
    @abstractmethod
    def preprocess(self, dataframe: DataFrame, dataset_meta: Dataset) -> DataFrame:
        pass


def get_normalization_layer(name, dataset):
    # Create a Normalization layer for our feature.
    normalizer = Normalization(axis=None)

    # Prepare a Dataset that only yields our feature.
    feature_ds = dataset[name]

    # Learn the statistics of the data.
    normalizer.adapt(feature_ds)

    return normalizer


def get_category_encoding_layer(name, dataset, dtype, max_tokens=None):
    # Create a StringLookup layer which will turn strings into integer indices
    if dtype == "string":
        index = StringLookup(max_tokens=max_tokens)
    else:
        index = IntegerLookup(max_tokens=max_tokens)

    # Prepare a Dataset that only yields our feature
    feature_ds = dataset[name]

    # Learn the set of possible values and assign them a fixed integer index.
    index.adapt(feature_ds)

    # Create a Discretization for our integer indices.
    encoder = CategoryEncoding(num_tokens=index.vocabulary_size())

    # Apply one-hot encoding to our indices. The lambda function captures the
    # layer so we can use them, or include them in the functional model later.
    return lambda feature: encoder(index(feature))


def df_to_dataset(dataframe, shuffle=True, batch_size=32, target_variable="target"):
    dataframe = dataframe.copy()
    labels = pd.get_dummies(dataframe.pop(target_variable))
    ds = tf.data.Dataset.from_tensor_slices((dict(dataframe), labels))
    if shuffle:
        ds = ds.shuffle(buffer_size=len(dataframe))
    ds = ds.batch(batch_size)
    ds = ds.prefetch(batch_size)
    return ds


class OrdinalEncoderProps:
    def __init__(
        self,
        col_name,
        categories="auto",
        dtype=np.float64,
        handle_unknown="error",
        unknown_value=None,
    ) -> None:
        self.col_name = col_name
        self.categories = categories
        self.dtype = dtype
        self.handle_unknown = handle_unknown
        self.unknown_value = unknown_value

class DataFrameOrdinalencoder:
    def __init__(
        self, dataset_meta: Dataset, EncoderProps: List[OrdinalEncoderProps] = []
    ) -> None:
        self.encoder_props = {}
        for col_props in EncoderProps:
            self.encoder_props[col_props.col_name] = col_props

        self.dataset_meta = dataset_meta
        self.encoders = {}

    def _gen_ordinal_encoder(self,
        encoder_props: OrdinalEncoderProps = None,
    ) -> OrdinalEncoder:
        params = encoder_props.__dict__ or {}
        params.pop("col_name", None)
        encoder = OrdinalEncoder(**params)
        return encoder

    def fit(self, df: DataFrame) -> DataFrame:
        for col in self.dataset_meta.datasetFields:
            col: DatasetFeature = col
            if col.dataType is DataTypes.STRING:
                series = df[col.columnName]
                non_nulls = np.array(series.dropna()).reshape(-1, 1)
                encoder = self._gen_ordinal_encoder(self.encoder_props[col.columnName])
                ordinal_encoded = encoder.fit_transform(non_nulls)
                self.encoders[col.columnName] = encoder
                series.loc[series.notnull()] = np.squeeze(ordinal_encoded)
                df[col.columnName] = series
        return df

    def inverse_transform(self, df: DataFrame):
        for col_name, encoder in self.encoders.items():
            encoder: OrdinalEncoder = encoder
            decoded_series = np.squeeze(
                encoder.inverse_transform(np.array(df[col_name]).reshape(-1, 1))
            )
            df[col_name] = decoded_series
        return df

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Tuple
from utils.enums import Coltype, DataTypes

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
from tensorflow.keras import Input, layers


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
    target = dataframe.pop(target_variable)
    labels = pd.get_dummies(target)
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

    def inverse_transform(self, df: DataFrame)->DataFrame:
        for col_name, encoder in self.encoders.items():
            encoder: OrdinalEncoder = encoder
            decoded_series = np.squeeze(
                encoder.inverse_transform(np.array(df[col_name]).reshape(-1, 1))
            )
            df[col_name] = decoded_series
        return df


class KerasPreProcessingEncoder:
    def __init__(self, dataset: Dataset, raw_dataset, target_feature) -> None:
        self.dataset = dataset
        self.raw_dataset = raw_dataset
        self.target_feature = target_feature

    def _get_discrete_cols(self) -> List[DatasetFeature]:
        dataset_features = self.dataset.datasetFields
        return filter(
            lambda x: x.columnName != self.target_feature
            and x.colType == Coltype.DISCRETE,
            dataset_features,
        )

    def _get_continous_cols(self) -> List[DatasetFeature]:
        dataset_features = self.dataset.datasetFields
        return filter(
            lambda x: x.columnName != self.target_feature
            and x.colType == Coltype.CONTINOUS,
            dataset_features,
        )

    def _build_input_layer(self, col: DatasetFeature) -> Input:
        input_prop = None
        if col.colType == Coltype.CONTINOUS:
            input_prop = Input(shape=(1,), name=col.columnName)
        else:
            dtype = "string" if col.dataType == DataTypes.STRING else None
            input_prop = Input(shape=(1,), name=col.columnName, dtype=dtype)
        return input_prop

    def _build_discrete_preprocessor(self, col: DatasetFeature):
        input_layer = self._build_input_layer(col)
        dtype = "string" if col.dataType == DataTypes.STRING else "int64"
        encoding_layer = get_category_encoding_layer(
            col.columnName, self.raw_dataset, dtype=dtype, max_tokens=5
        )
        encoded_col = encoding_layer(input_layer)
        return input_layer, encoded_col

    def _build_continous_preprocessor(self, col: DatasetFeature):
        input_layer = self._build_input_layer(col)
        normalization_layer = get_normalization_layer(col.columnName, self.raw_dataset)
        encoded_col = normalization_layer(input_layer)
        return input_layer, encoded_col

    def get_input_preprocessing_layers(self) -> Tuple[List[Input], Any]:

        all_inputs = []
        encoded_features = []
        discrete_cols = self._get_discrete_cols()
        continous_cols = self._get_continous_cols()

        for col in continous_cols:
            input_layer, preprocessing_layer = self._build_continous_preprocessor(col)
            all_inputs.append(input_layer)
            encoded_features.append(preprocessing_layer)

        for col in discrete_cols:
            input_layer, preprocessing_layer = self._build_discrete_preprocessor(col)
            all_inputs.append(input_layer)
            encoded_features.append(preprocessing_layer)

        all_features = layers.concatenate(encoded_features)

        return all_inputs, all_features

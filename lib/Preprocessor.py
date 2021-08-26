from abc import ABC, abstractmethod
from typing import Dict, List
from utils.enums import DataTypes

import numpy as np
from numpy.lib.function_base import select
from db.models.Dataset import Dataset, DatasetFeature
from pandas.core.frame import DataFrame
from sklearn.preprocessing import OrdinalEncoder


class Preprocessor(ABC):
    @abstractmethod
    def preprocess(self, dataframe: DataFrame, dataset_meta: Dataset) -> DataFrame:
        pass


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

    def _gen_ordinal_encoder(
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
                encoder = self._gen_ordinal_encoder()
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

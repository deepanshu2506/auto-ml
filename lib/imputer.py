from abc import ABC, abstractmethod
from typing import Union
from utils.enums import ImputationMethods
from pandas import DataFrame
from sklearn.preprocessing import OrdinalEncoder
from sklearn.impute import KNNImputer as KNNImputerBase
import numpy as np


class Imputer(ABC):
    @abstractmethod
    def impute(self, dataframe: DataFrame) -> DataFrame:
        pass


class ImputerFactory:
    @staticmethod
    def get_imputer(type: ImputationMethods, **kwargs) -> Imputer:
        if type == SingleColImputationMethods.MEAN:
            return MeanImputer(column_name=kwargs["column_name"])
        elif type == SingleColImputationMethods.MEDIAN:
            return MedianImputer(column_name=kwargs["column_name"])
        elif type == SingleColImputationMethods.MAX_FREQUENCY:
            return MaxFrequencyImputer(column_name=kwargs["column_name"])
        elif type == SingleColImputationMethods.KNN:
            return KNNImputer(column_name=kwargs["column_name"])
        elif type == SingleColImputationMethods.VALUE:
            return ValueImputer(
                column_name=kwargs["column_name"], value=kwargs["value"]
            )
        else:
            raise ValueError("Invalid Imputer type")


class MeanImputer(Imputer):
    def __init__(self, column_name) -> None:
        super().__init__()
        self.column_name = column_name

    def impute(self, dataframe: DataFrame) -> DataFrame:
        series = dataframe[self.column_name]
        mean = series.mean(skipna=True)
        dataframe[self.column_name] = series.fillna(mean)
        return dataframe


class MedianImputer(Imputer):
    def __init__(self, column_name) -> None:
        super().__init__()
        self.column_name = column_name

    def impute(self, dataframe: DataFrame) -> DataFrame:
        series = dataframe[self.column_name]
        median = series.median(skipna=True)
        print(median)
        dataframe[self.column_name] = series.fillna(median)
        return dataframe


class ValueImputer(Imputer):
    def __init__(self, column_name, value) -> None:
        super().__init__()
        self.column_name = column_name
        self.value = value

    def impute(self, dataframe: DataFrame) -> DataFrame:
        dataframe[self.column_name] = dataframe[self.column_name].fillna(self.value)
        return dataframe


class MaxFrequencyImputer(Imputer):
    def __init__(self, column_name) -> None:
        super().__init__()
        self.column_name = column_name

    def impute(self, dataframe: DataFrame) -> DataFrame:
        series = dataframe[self.column_name]
        value = series.value_counts().idxmax()
        dataframe[self.column_name] = series.fillna(value)
        return dataframe


class KNNImputer(Imputer):
    def __init__(self, column_name) -> None:
        super().__init__()
        self.column_name = column_name
        self.ordinalEncoder = OrdinalEncoder()
        self.knn = KNNImputerBase(n_neighbors=5)

    def impute(self, dataframe: DataFrame) -> DataFrame:
        series = dataframe[self.column_name]
        non_nulls = np.array(series.dropna()).reshape(-1, 1)
        ordinal_encoded = self.ordinalEncoder.fit_transform(non_nulls)
        series.loc[series.notnull()] = np.squeeze(ordinal_encoded)
        dataframe[self.column_name] = series
        imputed_data = self.knn.fit_transform(dataframe)
        df_temp = DataFrame(imputed_data, columns=dataframe.columns)
        df_temp[self.column_name] = np.squeeze(
            self.ordinalEncoder.inverse_transform(
                np.array(df_temp[self.column_name]).reshape(-1, 1)
            )
        )
        dataframe[self.column_name] = df_temp[self.column_name]
        return dataframe

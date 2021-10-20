from abc import ABC, abstractmethod
from utils.enums import ImputationMethods
from pandas import DataFrame
from sklearn.preprocessing import OrdinalEncoder
from sklearn.impute import KNNImputer as KNNImputerBase
from db.models.Dataset import Dataset
import numpy as np
from lib.Preprocessor import DataFrameOrdinalencoder, OrdinalEncoderProps

class Imputer(ABC):
    @abstractmethod
    def impute(self, dataframe: DataFrame) -> DataFrame:
        pass


class ImputerFactory:
    @staticmethod
    def get_imputer(type: ImputationMethods, **kwargs) -> Imputer:
        if type == ImputationMethods.MEAN:
            return MeanImputer(column_name=kwargs["column_name"])
        elif type == ImputationMethods.MEDIAN:
            return MedianImputer(column_name=kwargs["column_name"])
        elif type == ImputationMethods.MAX_FREQUENCY:
            return MaxFrequencyImputer(column_name=kwargs["column_name"])
        elif type == ImputationMethods.KNN:
            return KNNImputer(column_name=kwargs["column_name"],dataset=kwargs["dataset"])
        elif type == ImputationMethods.VALUE:
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
    def __init__(self, column_name,dataset) -> None:
        super().__init__()
        self.column_name = column_name
        self.ordinalEncoder = OrdinalEncoder()
        self.knn = KNNImputerBase(n_neighbors=5)
        self.dataset=dataset

    def impute(self,dataframe: DataFrame) -> DataFrame:
        EncoderProps = []
        for col in dataframe.columns:
            obj = OrdinalEncoderProps(col)
            EncoderProps.append(obj)
        encodingObj = DataFrameOrdinalencoder(self.dataset, EncoderProps)
        dataframe_encoded = encodingObj.fit(dataframe.copy(deep=True))
        imputed_data = self.knn.fit_transform(dataframe_encoded)
        df_temp = DataFrame(imputed_data, columns=dataframe.columns) 
        imputed_dataset = encodingObj.inverse_transform(df_temp)      
        dataframe[self.column_name] = imputed_dataset[self.column_name]
        return dataframe


class IterativeImputer(Imputer):
    def __init__(self, target_col) -> None:
        self.target_col = target_col

    def impute(self, dataframe: DataFrame) -> DataFrame:
        X = dataframe.loc[:, ~dataframe.columns.isin([self.target_col])]
        Y = dataframe[self.target_col]

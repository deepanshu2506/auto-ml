from abc import ABC, abstractmethod
from typing import Dict
from pandas import DataFrame
import numpy as np
import pandas as pd

# To use this experimental feature, we need to explicitly ask for it:
from sklearn.experimental import enable_iterative_imputer  # noqa
from sklearn.impute import SimpleImputer
from sklearn.impute import IterativeImputer
from sklearn.linear_model import BayesianRidge
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import ExtraTreesRegressor
from sklearn.neighbors import KNeighborsRegressor

from warnings import simplefilter
from sklearn.exceptions import ConvergenceWarning


class AutoImputer(ABC):
    @abstractmethod
    def impute(self, dataframe: DataFrame) -> DataFrame:
        pass


class DecisionTreeImputer(AutoImputer):
    def impute(self, dataframe: DataFrame) -> DataFrame:
        imp = IterativeImputer(
            estimator=DecisionTreeRegressor(max_features="sqrt", random_state=0),
            missing_values=np.nan,
        )
        imputed_np = imp.fit_transform(dataframe)
        df = pd.DataFrame(imputed_np, columns=dataframe.columns)
        return df


class BayesianRidgeImputer(AutoImputer):
    def impute(self, dataframe: DataFrame) -> DataFrame:
        imp = IterativeImputer(
            estimator=BayesianRidge(),
            missing_values=np.nan,
        )
        imputed_np = imp.fit_transform(dataframe)
        df = pd.DataFrame(imputed_np, columns=[dataframe.columns])
        return df


class MedianImputer(AutoImputer):
    def impute(self, dataframe: DataFrame) -> DataFrame:
        imp_median = SimpleImputer(missing_values=np.nan, strategy="median")
        dataframe_np = dataframe.to_numpy()
        imp_median.fit(dataframe_np)
        imputed_np = imp_median.transform(dataframe_np)
        df = pd.DataFrame(imputed_np)
        return df


class KNeighborsRegressorImputer(AutoImputer):
    def impute(self, dataframe: DataFrame) -> DataFrame:
        imp = IterativeImputer(
            estimator=KNeighborsRegressor(n_neighbors=5),
            missing_values=np.nan,
        )
        imputed_np = imp.fit_transform(dataframe)
        df = pd.DataFrame(imputed_np, columns=[dataframe.columns])
        return df


class ExtraTreesRegressorImputer(AutoImputer):
    def impute(self, dataframe: DataFrame) -> DataFrame:
        imp = IterativeImputer(
            estimator=ExtraTreesRegressor(n_estimators=10, random_state=0),
            missing_values=np.nan,
        )
        imputed_np = imp.fit_transform(dataframe)
        df = pd.DataFrame(imputed_np, columns=[dataframe.columns])
        return df


class MeanImputer(AutoImputer):
    def impute(self, dataframe: DataFrame) -> DataFrame:
        imp_mean = SimpleImputer(missing_values=np.nan, strategy="mean")
        dataframe_np = dataframe.to_numpy()
        imp_mean.fit(dataframe_np)
        imputed_np = imp_mean.transform(dataframe_np)
        df = pd.DataFrame(imputed_np)
        return df


imputer_map: Dict[int, AutoImputer] = {
    0: DecisionTreeImputer,
    1: BayesianRidgeImputer,
    2: MedianImputer,
    3: KNeighborsRegressorImputer,
    4: ExtraTreesRegressorImputer,
    5: MeanImputer,
}


class AutoImputerFactory:
    @staticmethod
    def get_auto_imputer(features, df: DataFrame, loaded_model) -> DataFrame:
        predicted_imputer_ind = loaded_model.predict(
            [
                [
                    features["is_classification"],
                    features["percent_null"],
                    features["rows_count"],
                    features["cols_count"],
                    features["continous_count"],
                    features["discrete_count"],
                    features["unique_ratio"],
                    features["top_n_unique_ratio"],
                ]
            ]
        )
        print(predicted_imputer_ind)
        simplefilter("ignore", category=ConvergenceWarning)
        imputer = imputer_map.get(int(predicted_imputer_ind), MeanImputer)
        imputerInstance = imputer()
        imputation_type = imputerInstance.__class__.__name__
        imputed_df = imputerInstance.impute(df)
        return imputed_df, imputation_type

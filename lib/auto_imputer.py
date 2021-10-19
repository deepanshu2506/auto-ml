import pickle
from pandas import DataFrame
from numpy import std
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
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import Pipeline
from warnings import simplefilter
from sklearn.exceptions import ConvergenceWarning
class AutoImputerFactory:   
    @staticmethod
    def get_auto_imputer(features,df: DataFrame,loaded_model) -> DataFrame:
        # load the model from disk
        # filename="randomforest_model.sav"
        # loaded_model = pickle.load(open(filename, 'rb'))
        #predicted_imputer_ind=loaded_model.predict([False,5.0,1000,7,2,5,0.081,0.293])
        predicted_imputer_ind=loaded_model.predict([[ features['is_classification'],features['percent_null'],features['rows_count'],features['cols_count'],features['continous_count'],features['discrete_count'],features['unique_ratio'],features['top_n_unique_ratio'] ]])
        print(predicted_imputer_ind)
        simplefilter("ignore", category=ConvergenceWarning)
        if predicted_imputer_ind==0:
            print("DecisionTreeImputer")
            imputation_type="DecisionTreeImputer"
            imputed_df=DecisionTreeImputer.impute(df)
        elif predicted_imputer_ind==1:
            print("BayesianRidgeImputer")
            imputation_type="BayesianRidgeImputer"
            imputed_df=BayesianRidgeImputer.impute(df)
        elif predicted_imputer_ind==2:
            print("MedianImputer")
            imputation_type="MedianImputer"
            imputed_df=MedianImputer.impute(df)
        elif predicted_imputer_ind==3:
            print("KNeighborsRegressorImputer")
            imputation_type="KNeighborsRegressorImputer"
            imputed_df=KNeighborsRegressorImputer.impute(df)
        elif predicted_imputer_ind==4:
            print("ExtraTreesRegressorImputer")
            imputation_type="ExtraTreesRegressor"
            imputed_df=ExtraTreesRegressorImputer.impute(df)
        else:
            print("MeanImputer")
            imputation_type="MeanImputer"
            imputed_df=MeanImputer.impute(df)
        return imputed_df,imputation_type

class DecisionTreeImputer():
    @staticmethod
    def impute(dataframe: DataFrame) -> DataFrame:
        # dataframe_np= dataframe.to_numpy()
        imp = IterativeImputer(estimator=DecisionTreeRegressor(max_features='sqrt',random_state=0),missing_values=np.nan, )
        imputed_np=imp.fit_transform(dataframe)
        df = pd.DataFrame(imputed_np,columns=dataframe.columns)
        return df

class BayesianRidgeImputer():
    @staticmethod
    def impute(dataframe: DataFrame) -> DataFrame:
        # dataframe_np= dataframe.to_numpy()
        imp = IterativeImputer(estimator=BayesianRidge(),missing_values=np.nan, )
        imputed_np=imp.fit_transform(dataframe)
        df = pd.DataFrame(imputed_np,columns=[dataframe.columns])
        return df

class MedianImputer():
    @staticmethod
    def impute(dataframe: DataFrame) -> DataFrame:
        # fill missing values with median column values
        imp_median = SimpleImputer(missing_values=np.nan, strategy='median')
        dataframe_np= dataframe.to_numpy()
        imp_median.fit(dataframe_np)
        imputed_np=imp_median.transform(dataframe_np)
        df = pd.DataFrame(imputed_np)
        # dataframe.fillna(dataframe.median(skipna=True), inplace=True)
        return df
class KNeighborsRegressorImputer():
    @staticmethod
    def impute(dataframe: DataFrame) -> DataFrame:
        # dataframe_np= dataframe.to_numpy()
        imp = IterativeImputer(estimator=KNeighborsRegressor(n_neighbors=5),missing_values=np.nan, )
        imputed_np=imp.fit_transform(dataframe)
        df = pd.DataFrame(imputed_np,columns=[dataframe.columns])
        return df

class ExtraTreesRegressorImputer():
    @staticmethod
    def impute(dataframe: DataFrame) -> DataFrame:
        # dataframe_np= dataframe.to_numpy()
        imp = IterativeImputer(estimator= ExtraTreesRegressor(n_estimators=10, random_state=0),missing_values=np.nan, )
        imputed_np=imp.fit_transform(dataframe)
        df = pd.DataFrame(imputed_np,columns=[dataframe.columns])
        return df

class MeanImputer():
    @staticmethod
    def impute(dataframe: DataFrame) -> DataFrame:
        # fill missing values with mean column values
        imp_mean = SimpleImputer(missing_values=np.nan, strategy='mean')
        dataframe_np= dataframe.to_numpy()
        imp_mean.fit(dataframe_np)
        imputed_np=imp_mean.transform(dataframe_np)
        df = pd.DataFrame(imputed_np)
        # dataframe.fillna(dataframe.mean(skipna=True), inplace=True)
        return df





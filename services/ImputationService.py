from datetime import datetime
from typing import List
from lib.Preprocessor import DataFrameOrdinalencoder, OrdinalEncoderProps
from services.OperationService import OperationsService
from utils.enums import (
    Coltype,
    DatasetStates,
    ImputationMethods,
    JobTypes,
)
from utils.pdUtils import is_discrete_auto_impute
from flask_jwt_extended.utils import get_jwt_identity
from services.FileService import FileService
from pandas import DataFrame
from services.DatasetService import DatasetService
from lib.auto_imputer import AutoImputerFactory


from db.models.Dataset import Dataset, DatasetFeature, DatasetJob, JobStats


class ImputationService:
    def __init__(
        self,
        fileService: FileService,
        operationService: OperationsService,
        datasetService: DatasetService,
        imputer_model,
    ) -> None:
        self.fileService = fileService
        self.operationService = operationService
        self.datasetService = datasetService
        self.imputer_model = imputer_model

    def impute_col(
        self, dataset_id, col_name, impute_type: ImputationMethods, value=None
    ):
        dataset = self.datasetService.find_by_id(dataset_id, get_jwt_identity())

        output = self.operationService.perform_operation(
            dataset=dataset,
            jobType=JobTypes.SINGLE_COL_IMPUTATION,
            inputs={"impute_type": impute_type, "col_name": col_name, "value": value},
        )
        return output

    def get_features(self, dataset: Dataset, dataset_frame, target_col_name):
        features = {}
        features["rows_count"] = dataset.info.tupleCount
        dataset_fields: List[DatasetFeature] = dataset.datasetFields
        features["cols_count"] = len(dataset_fields)
        (
            features["is_classification"],
            features["unique_ratio"],
            features["top_n_unique_ratio"],
        ) = is_discrete_auto_impute(dataset_frame[target_col_name])
        discrete_count = 0
        continous_count = 0
        null_count = 0
        print("-----Before imputation df ------")
        print(dataset_frame.head())

        imputed_col_stats = []

        for i in range(features["cols_count"]):
            null = dataset_fields[i].metrics.missingValues
            if null != 0:
                null_count += null
                c = {
                    "col_name": dataset_fields[i].columnName,
                    "imputed_count": null,
                }
                imputed_col_stats.append(c)
            if dataset_fields[i].colType == Coltype.DISCRETE:
                discrete_count += 1
            else:
                continous_count += 1

        perc_null = (null_count / features["rows_count"]) * 100
        print("Before null count=", null_count)
        # null_count=self.calc_null(dataset_frame_null)
        # perc_null=(null_count/features['rows_count'])*100
        # print("After null count=",null_count)
        features["percent_null"] = perc_null
        features["discrete_count"] = discrete_count
        features["continous_count"] = continous_count
        print("Features", features)
        return features, dataset, dataset_frame, imputed_col_stats, null_count

    def impute_dataset(self, dataset_id, target_col_name):
        job_start_time = datetime.utcnow()
        dataset: Dataset = self.datasetService.find_by_id(
            dataset_id, get_jwt_identity()
        )
        dataset_frame: DataFrame = self.fileService.get_dataset_from_url(
            dataset.datasetLocation
        )
        # dataset_frame = read_csv('horse-colic.csv', na_values='?')
        # dataset_frame=dataset_frame.replace(to_replace=np.NaN,value='?')
        print("Auto Imputation")
        (
            features,
            dataset,
            dataset_frame_null,
            imputed_col_stats,
            null_count,
        ) = self.get_features(dataset, dataset_frame, target_col_name)
        if null_count == 0:
            return ["Null", "No need of data imputation!!"]

        EncoderProps = []
        for col in dataset.datasetFields:
            obj = OrdinalEncoderProps(col.columnName)
            EncoderProps.append(obj)
        encodingObj = DataFrameOrdinalencoder(dataset, EncoderProps)
        dataframe_encoded = encodingObj.fit(dataset_frame_null.copy(deep=True))
        # print("-----Encoded df------")
        # print(dataframe_encoded.head())
        imputer = AutoImputerFactory.get_auto_imputer(
            features, loaded_model=self.imputer_model
        )
        impute_type = imputer.__class__.__name__
        dataframe_imputed = imputer.impute(dataframe_encoded)
        # dataframe_imputed=ExtraTreesRegressorImputer.impute(dataframe_encoded)
        # print("-----Encoded Imputed df------")
        # print(dataframe_imputed.head())
        imputed_dataset = encodingObj.inverse_transform(dataframe_imputed)
        print("-----Final imputed df-----")
        print(imputed_dataset.head())
        self.fileService.save_dataset(
            imputed_dataset,
            dataset_path=dataset.datasetLocation,
        )
        job_end_time = datetime.utcnow()
        dataset.datasetFields = self.datasetService._extract_fields(imputed_dataset)
        job_stats = JobStats(jobStart=job_start_time, jobEnd=job_end_time)
        job_stats.colsImputed = len(imputed_col_stats)
        job_stats.imputationType = impute_type
        job_stats.cols = imputed_col_stats
        imputation_job = DatasetJob(
            jobType=JobTypes.MULTI_COL_IMPUTATION, stats=job_stats
        )
        dataset.jobs.append(imputation_job)
        dataset.state = DatasetStates.IMPUTED
        dataset.save()
        return [impute_type, imputed_col_stats]

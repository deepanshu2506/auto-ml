from datetime import datetime

from lib.Preprocessor import DataFrameOrdinalencoder
from lib.imputer import Imputer, ImputerFactory
from typing import List
from utils.enums import AggregationMethods, Coltype, DataTypes, DatasetStates, JobTypes
from utils.exceptions import DatasetNotFound
import numpy
from pandas.core.series import Series
from utils.pdUtils import (
    build_query,
    get_col_type,
    get_datatype,
    perform_aggregation,
    is_discrete_auto_impute,
)
from flask_jwt_extended.utils import get_jwt_identity
from services.FileService import FileService
from pandas import DataFrame
import numpy as np
from werkzeug.datastructures import FileStorage
import random
from db.models.Dataset import (
    Dataset,
    DatasetFeature,
    DatasetFeatureMetrics,
    DatasetInfo,
    DatasetJob,
    JobStats,
)


class DatasetService:
    def __init__(self, fileService: FileService) -> None:
        self.fileService = fileService

    def _build_column_metrics(self, column_metrics: Series, column_values: Series):
        featureMetrics = DatasetFeatureMetrics()
        if column_metrics is not None:
            featureMetrics.min = column_metrics["min"]
            featureMetrics.max = column_metrics["max"]
            featureMetrics.stdDeviation = column_metrics["std"]
            featureMetrics.median = numpy.nanmedian(column_values)

        unique_values = column_values.unique().tolist()
        featureMetrics.uniqueValues = len(unique_values)
        featureMetrics.samples = unique_values[: min(5, len(unique_values))]
        featureMetrics.missingValues = column_values.isnull().sum()
        return featureMetrics

    def _extract_fields(self, dataset: DataFrame):
        datasetFields: List[DatasetFeature] = []
        dataTypes = dataset.dtypes
        columnNames = dataset.columns.values.tolist()
        dataset_metrics = dataset.describe()

        for idx, (columnName, dataType) in enumerate(zip(columnNames, dataTypes)):
            colDataType: DataTypes = get_datatype(dataType)
            colData: Series = dataset.iloc[:, idx]
            colType: Coltype = get_col_type(colData, colDataType)
            datasetFeature = DatasetFeature(
                columnOrder=idx + 1,
                columnName=columnName,
                dataType=colDataType,
                colType=colType,
            )
            cols_with_metrics: list = dataset_metrics.columns.tolist()
            raw_column_metrics = (
                dataset_metrics.iloc[:, cols_with_metrics.index(columnName)]
                if columnName in cols_with_metrics
                else None
            )
            datasetFeature.metrics = self._build_column_metrics(
                raw_column_metrics, colData
            )
            datasetFields.append(datasetFeature)
        return datasetFields

    def createDataset(self, dataset_raw_file: FileStorage, datasetName: str) -> Dataset:
        user_id = get_jwt_identity()
        dataset_raw = self.fileService.convert_to_dataset(dataset_raw_file)
        dataset = Dataset(
            createdBy=user_id,
            name=datasetName,
        )

        dataset = dataset.save()
        file_path, file_size = self.fileService.save_dataset(
            dataset_raw, user_id=user_id, dataset_id=dataset.id
        )
        tupleCount = len(dataset_raw.index)
        dataset.datasetLocation = file_path
        dataset.info = DatasetInfo(fileSize=file_size, tupleCount=tupleCount)
        dataset.datasetFields = self._extract_fields(dataset_raw)
        dataset = dataset.save()
        return dataset

    def get_datasets(self, user_id) -> List[Dataset]:
        return Dataset.objects(createdBy=user_id, isDeleted=False)

    def find_by_id(self, id, user_id) -> Dataset:
        datasets = Dataset.objects(createdBy=user_id, id=id, isDeleted=False)
        if len(datasets) == 0:
            raise DatasetNotFound
        return datasets[0]

    def delete_dataset(self, id, user_id) -> None:
        dataset = self.find_by_id(id, user_id)
        dataset.isDeleted = True
        dataset.save()

    def get_discrete_col_details(self, id, user_id, num_samples=10) -> None:
        dataset = self.find_by_id(id, user_id)
        dataset_frame: DataFrame = self.fileService.get_dataset_from_url(
            dataset.datasetLocation
        )

        discrete_cols = list(
            filter(lambda col: col.colType == Coltype.DISCRETE, dataset.datasetFields)
        )
        discrete_col_names = list(map(lambda col: col.columnName, discrete_cols))
        discrete_data: DataFrame = dataset_frame[discrete_col_names]
        col_details = {}
        for col in discrete_data:
            unique_vals = discrete_data[col].unique()
            col_details[col] = {
                "values": unique_vals[:num_samples].tolist(),
                "unique_count": unique_vals.size,
                "total_count": discrete_data[col].size,
            }
        return col_details

    def perform_aggregation(
        self,
        dataset_id,
        aggregate_method: AggregationMethods,
        groupby_field: str,
        aggregate_by_field: str,
        filter: dict,
    ):
        dataset: Dataset = self.find_by_id(dataset_id, get_jwt_identity())
        dataset_frame: DataFrame = self.fileService.get_dataset_from_url(
            dataset.datasetLocation
        )
        if filter:
            filter_query = build_query(filter)
            print(filter_query)
            dataset_frame: DataFrame = dataset_frame.query(filter_query)

        aggregated_df = perform_aggregation(
            dataset_frame.groupby(groupby_field)[aggregate_by_field],
            aggregate_func=aggregate_method,
        )
        aggregation_result = list(aggregated_df.iteritems())
        headers = (
            groupby_field,
            f"{aggregate_by_field.replace(' ' , '_')}_{aggregate_method.value}",
        )
        return headers, aggregation_result

    def impute_col(self, dataset_id, col_name, impute_type, value=None):
        job_start_time = datetime.utcnow()
        dataset: Dataset = self.find_by_id(dataset_id, get_jwt_identity())
        dataset_frame: DataFrame = self.fileService.get_dataset_from_url(
            dataset.datasetLocation
        )
        null_count = dataset_frame[col_name].isnull().sum()

        imputer: Imputer = ImputerFactory.get_imputer(
            impute_type, column_name=col_name, value=value
        )
        imputed_dataset = imputer.impute(dataset_frame)
        self.fileService.save_dataset(
            imputed_dataset,
            dataset_path=dataset.datasetLocation,
        )
        job_end_time = datetime.utcnow()

        dataset.datasetFields = self._extract_fields(imputed_dataset)
        imputed_col_stats = [
            {
                "col_name": col_name,
                "imputed_count": null_count,
            }
        ]

        job_stats = JobStats(jobStart=job_start_time, jobEnd=job_end_time)
        job_stats.colsImputed = 1
        job_stats.imputationType = impute_type
        job_stats.cols = imputed_col_stats
        imputation_job = DatasetJob(
            jobType=JobTypes.SINGLE_COL_IMPUTATION, stats=job_stats
        )
        dataset.jobs.append(imputation_job)
        Dataset.state = DatasetStates.PARTIALLY_IMPUTED
        dataset.save()
        return imputed_col_stats

    def add_null(self, df):
        ix = [(row, col) for row in range(df.shape[0]) for col in range(df.shape[1])]
        for row, col in random.sample(ix, int(round(0.1 * len(ix)))):
            df.iat[row, col] = np.nan
        return df

    def calc_null(self, df):
        null_val = df.isnull().sum().sum()
        print(null_val)

    def impute_dataset(self, dataset_id, target_col_name):
        dataset: Dataset = self.find_by_id(dataset_id, get_jwt_identity())
        dataset_frame: DataFrame = self.fileService.get_dataset_from_url(
            dataset.datasetLocation
        )
        print("Auto Imputation")
        # print(dataset_frame)
        features = {}
        features["rows_count"] = dataset.info.tupleCount
        dataset_fields = dataset.datasetFields
        features["cols_count"] = len(dataset_fields)
        (
            features["is_classification"],
            features["unique_ratio"],
            features["top_n_unique_ratio"],
        ) = is_discrete_auto_impute(dataset_frame[target_col_name])
        discrete_count = 0
        continous_count = 0
        null_count = 0
        dataset_frame = self.add_null(dataset_frame)
        for i in range(features["cols_count"]):
            null_count += dataset_fields[i]["metrics"]["missingValues"]
            if dataset_fields[i]["colType"] == Coltype.DISCRETE:
                discrete_count += 1
            else:
                continous_count += 1

        features["percent_null"] = (null_count / features["rows_count"]) * 100
        features["discrete_count"] = discrete_count
        features["continous_count"] = continous_count
        print(features)
        self.calc_null(dataset_frame)
        # ordinalEncoder = DataFrameOrdinalencoder(dataset_meta=dataset)
        # preprocessed_frame = ordinalEncoder.fit(dataset_frame)

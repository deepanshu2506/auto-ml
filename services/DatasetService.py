from typing import List
from utils.exceptions import DatasetNotFound

from numpy import not_equal
import numpy
from pandas.core.series import Series
from utils.pdUtils import get_datatype, perform_aggregation
from flask_jwt_extended.utils import get_jwt_identity
from services.FileService import FileService
from pandas import DataFrame
from werkzeug.datastructures import FileStorage
from db.models.Dataset import (
    Dataset,
    DatasetFeature,
    DatasetFeatureMetrics,
    DatasetInfo,
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
            colType = get_datatype(dataType)
            datasetFeature = DatasetFeature(
                columnOrder=idx + 1,
                columnName=columnName,
                dataType=colType,
            )
            cols_with_metrics = dataset_metrics.columns.tolist()
            raw_column_metrics = (
                dataset_metrics.iloc[:, cols_with_metrics.index(columnName)]
                if columnName in cols_with_metrics
                else None
            )
            datasetFeature.metrics = self._build_column_metrics(
                raw_column_metrics, dataset.iloc[:, idx]
            )
            datasetFields.append(datasetFeature)
        return datasetFields

    def createDataset(self, dataset_raw_file: FileStorage, datasetName: str) -> Dataset:
        user_id = get_jwt_identity()
        dataset_raw = self.fileService.convert_to_dataset(dataset_raw_file)
        dataset = Dataset(createdBy=user_id, name=datasetName)

        # dataset = dataset.save()
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

    def perform_aggregation(
        self, dataset_id, aggregate_method, groupby_field, aggregate_by_field
    ):
        dataset: Dataset = self.find_by_id(dataset_id, get_jwt_identity())
        dataset_frame: DataFrame = self.fileService.get_dataset_from_url(
            dataset.datasetLocation
        )

        aggregated_df = perform_aggregation(
            dataset_frame.groupby(groupby_field)[aggregate_by_field],
            aggregate_func=aggregate_method,
        )
        aggregation_result = list(aggregated_df.iteritems())
        aggregation_result.insert(
            0, (groupby_field, f"{aggregate_by_field}_{aggregate_method.value}")
        )
        return aggregation_result

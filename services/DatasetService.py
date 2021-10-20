from typing import List
from utils.enums import AggregationMethods, Coltype, DataTypes
from utils.exceptions import DatasetNotFound
import numpy
from pandas.core.series import Series
from utils.pdUtils import build_query, get_col_type, get_datatype, perform_aggregation
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
            lower_quantile = column_values.quantile(0.25)
            upper_quantile = column_values.quantile(0.75)
            iqr = upper_quantile - lower_quantile
            outlier_count = sum(i < (lower_quantile-(1.5*iqr)) for i in column_values.tolist()) + sum(i > (upper_quantile+(1.5*iqr)) for i in column_values.tolist())
            # print("Lower Q",lower_quantile)
            # print("Upper Q",upper_quantile)
            # print("IQR",iqr)
            # print("Outliers count",outlier_count)
            featureMetrics.outlier_count = outlier_count
            featureMetrics.min = column_metrics["min"]
            featureMetrics.max = column_metrics["max"]
            featureMetrics.stdDeviation = column_metrics["std"]
            featureMetrics.median = numpy.nanmedian(column_values)
        else:
            featureMetrics.value_percentage =(dict((column_values.value_counts() / len(column_values))*100))
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
        return dataset.id

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

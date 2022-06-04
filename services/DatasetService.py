from typing import Dict, List

from lib.integrations.DataSourceFactory import DatasourceFactory
from lib.operations.MetricsExtractor.MetricsExtractor import DatasetMetricsExtractor
from lib.preprocessing import (
    clean_col_names,
    replace_boolean,
    replace_nulls,
)
from utils.enums import AggregationMethods, Coltype, DatasetType
from utils.exceptions import DatasetNotFound
import numpy
from utils.pdUtils import build_query, perform_aggregation
from flask_jwt_extended.utils import get_jwt_identity
from services.FileService import FileService
from pandas import DataFrame
from werkzeug.datastructures import FileStorage
from db.models.Dataset import Dataset, DatasetFeature


class DatasetService:
    def __init__(self, fileService: FileService) -> None:
        self.fileService = fileService

    def createDataset(
        self,
        datasetName: str,
        dataset_raw_file: FileStorage = None,
        type: str = "file",
        **kwargs,
    ) -> Dataset:

        user_id = get_jwt_identity()

        dataset_raw = None
        dataset: Dataset = None
        dataset_type = None
        datasource_properties = None

        if type == "file":
            dataset_raw = self.fileService.convert_to_dataset(dataset_raw_file)
            dataset_type = DatasetType.CSV
        else:
            query = kwargs.get("query")
            datasource = DatasourceFactory.get_datasource(type, **kwargs)
            dataset_raw = datasource.create_dataset(query)
            datasource_properties = datasource.get_datasource_properties()
            dataset_type = DatasetType.SQL

        dataset = Dataset(
            createdBy=user_id,
            name=datasetName,
            type=dataset_type,
            datasource_type=type,
            datasource_properties=datasource_properties,
        )

        null_placeholder = kwargs.get("null_placeholder", numpy.nan)
        dataset_raw = replace_nulls(dataset_raw, null_placeholder)

        dataset_raw = clean_col_names(dataset_raw)
        dataset_raw = replace_boolean(dataset_raw)

        metricsExtractor = DatasetMetricsExtractor()
        dataset.datasetFields = metricsExtractor.extract_feature_metrics(dataset_raw)

        dataset = dataset.save()
        file_path, file_size = self.fileService.save_dataset(
            dataset_raw, user_id=user_id, dataset_id=dataset.id
        )
        dataset.datasetLocation = file_path
        datasetInfo = metricsExtractor.extract_dataset_metrics(dataset_raw)
        datasetInfo.fileSize = file_size
        dataset.info = datasetInfo
        dataset = dataset.save()
        return dataset.id

    def get_datasets(self, user_id) -> List[Dataset]:
        return Dataset.objects(createdBy=user_id, isDeleted=False).order_by(
            "-createdAt"
        )

    def getDataset(self, id, user_id) -> DataFrame:
        dataset = self.find_by_id(id, user_id)
        print(dataset.name)
        dataset_frame: DataFrame = self.fileService.get_dataset_from_url(
            dataset.datasetLocation
        )
        return dataset_frame, dataset.name

    def find_by_id(self, id, user_id) -> Dataset:
        datasets = Dataset.objects(createdBy=user_id, id=id, isDeleted=False)
        if len(datasets) == 0:
            raise DatasetNotFound
        return datasets[0]

    def delete_dataset(self, id, user_id) -> None:
        dataset = self.find_by_id(id, user_id)
        dataset.isDeleted = True
        dataset.save()

    def get_discrete_col_details(self, id, user_id, num_samples=None) -> None:
        dataset = self.find_by_id(id, user_id)
        dataset_frame: DataFrame = self.fileService.get_dataset_from_url(
            dataset.datasetLocation
        )

        discrete_cols: List[DatasetFeature] = list(
            filter(lambda col: col.colType == Coltype.DISCRETE, dataset.datasetFields)
        )
        discrete_col_names = list(map(lambda col: col.columnName, discrete_cols))
        discrete_data: DataFrame = dataset_frame[discrete_col_names]
        col_details = {}
        for col in discrete_cols:
            unique_vals = discrete_data[col.columnName].fillna("NA").unique()

            col_details[col.columnName] = {
                "values": (
                    unique_vals[:num_samples] if num_samples else unique_vals
                ).tolist(),
                "unique_count": unique_vals.size,
                "total_count": discrete_data[col.columnName].size,
                "data_type": col.dataType.value,
            }
        return col_details

    def perform_aggregation(
        self,
        dataset_id,
        aggregate_method: AggregationMethods = None,
        groupby_field: str = None,
        aggregate_by_field: str = None,
        filter: list = None,
        max_records=100,
        export_to_file=False,
    ):
        dataset: Dataset = self.find_by_id(dataset_id, get_jwt_identity())
        dataset_frame: DataFrame = self.fileService.get_dataset_from_url(
            dataset.datasetLocation
        )

        if filter:
            filter_query = build_query(filter)
            dataset_frame: DataFrame = dataset_frame.query(filter_query)
        aggregated_df = dataset_frame
        is_aggregate = groupby_field and aggregate_method and aggregate_by_field
        if is_aggregate:
            aggregated_df = perform_aggregation(
                dataset_frame.groupby(groupby_field)[aggregate_by_field],
                aggregate_func=aggregate_method,
            )
        aggregation_result = (
            list(aggregated_df.fillna("NA").iteritems())
            if is_aggregate
            else dataset_frame.fillna("NA").values.tolist()
        )
        meta = {"total_records": len(aggregation_result)}
        if not export_to_file:
            aggregation_result = aggregation_result[:max_records]
        meta["returned_records"] = len(aggregation_result)
        headers = (
            (
                groupby_field,
                f"{aggregate_by_field.replace(' ' , '_')}_{aggregate_method.value}",
            )
            if is_aggregate
            else dataset_frame.columns.tolist()
        )

        return headers, aggregation_result, meta

    def set_readme(self, dataset_id, user_id, readme_file_url):
        dataset = self.find_by_id(dataset_id, user_id)
        dataset.readmeURL = readme_file_url
        dataset.save()

    def get_readme(self, dataset_id, user_id):
        dataset = self.find_by_id(dataset_id, user_id)
        return dataset.readmeURL

    def set_col_description(
        self, dataset_id: str, user_id: str, column_descriptions: List[Dict]
    ) -> None:
        dataset: Dataset = self.find_by_id(dataset_id, user_id)
        column_descriptions_dict = {
            col.get("col_name"): col.get("description") for col in column_descriptions
        }

        for datasetField in dataset.datasetFields:
            datasetField: DatasetFeature = datasetField
            description = column_descriptions_dict.get(datasetField.columnName)
            if description:
                datasetField.columnDescription = description
        dataset.save()

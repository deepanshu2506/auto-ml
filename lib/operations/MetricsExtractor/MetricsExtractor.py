from typing import List
import numpy
from pandas import DataFrame, Series

from db.models.Dataset import (
    Dataset,
    DatasetFeature,
    DatasetFeatureMetrics,
    DatasetInfo,
)
from lib.operations.OperationOutput import OperationOutput
from lib.preprocessing import get_outlier_count, get_samples, get_value_percentage_dict
from utils.enums import Coltype, DataTypes
from utils.pdUtils import get_col_type, get_datatype


class DatasetMetricsExtractor:
    def extract_dataset_metrics(self, raw_dataset: DataFrame):
        tupleCount = len(raw_dataset.index)
        metrics = DatasetInfo(tupleCount=tupleCount)
        return metrics

    """
        extract metrics for columns, 
        extracts only for the affected columns if affected_columns is non none
    """

    def extract_feature_metrics(
        self,
        dataset: DataFrame,
        dataset_meta: Dataset = None,
        affected_columns: List[str] = None,
    ):
        datasetFields: List[DatasetFeature] = []
        dataTypes = dataset.dtypes
        columnNames = dataset.columns.values.tolist()
        dataset_metrics = dataset.describe()

        for idx, (columnName, dataType) in enumerate(zip(columnNames, dataTypes)):
            datasetFeature = None
            if (
                dataset_meta is None
                or affected_columns is None
                or columnName in affected_columns
            ):
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
                    if columnName in cols_with_metrics or colType == Coltype.CONTINOUS
                    else {}
                )
                datasetFeature.metrics = self._build_column_metrics(
                    raw_column_metrics, colData, colType
                )
            else:
                datasetFeature = dataset_meta.datasetFields[idx]

            datasetFields.append(datasetFeature)

        return datasetFields

    def _build_column_metrics(
        self, column_metrics: Series, column_values: Series, colType: Coltype
    ):
        featureMetrics = DatasetFeatureMetrics()

        if colType == Coltype.CONTINOUS:
            featureMetrics.outlier_count = get_outlier_count(column_values)

            featureMetrics.min = column_metrics["min"]
            featureMetrics.max = column_metrics["max"]
            featureMetrics.mean = column_metrics["mean"]
            featureMetrics.stdDeviation = column_metrics["std"]
            featureMetrics.median = numpy.nanmedian(column_values)
        else:
            featureMetrics.value_percentage = get_value_percentage_dict(column_values)

        unique_values = column_values.unique()
        print("--------")
        print(get_samples(Series(unique_values), 5).values)
        print("--------")
        featureMetrics.uniqueValues = len(unique_values.tolist())
        featureMetrics.samples = get_samples(Series(unique_values), 5).values
        featureMetrics.missingValues = column_values.isnull().sum()
        return featureMetrics


class JobMetricsExtractor:
    def extract_job_metrics(self, operationOutput: OperationOutput):
        pass

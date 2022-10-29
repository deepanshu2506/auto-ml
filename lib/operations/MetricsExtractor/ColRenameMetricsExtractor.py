from typing import List
from db.models.Dataset import DatasetFeature, JobStats
from lib.operations.MetricsExtractor.MetricsExtractor import (
    DatasetMetricsExtractor,
    JobMetricsExtractor,
)
from lib.operations.OperationOutput import OperationOutput
from lib.operations.inputTypes import MultiColRenameInput


class ColRenameMetricsExtractor(DatasetMetricsExtractor):
    def __init__(self, *args, **kwargs) -> None:
        super().__init__()

    def extract_feature_metrics(
        self, operationOutput: OperationOutput
    ) -> List[DatasetFeature]:
        datasetFeatures = operationOutput.dataset_meta.datasetFields

        for feature in datasetFeatures:
            feature: DatasetFeature = feature
            if feature.columnName in operationOutput.affected_columns:
                feature.columnName = operationOutput.metadata[feature.columnName]

        return datasetFeatures


class ColRenameJobMetricsExtractor(JobMetricsExtractor):
    def __init__(self, *args, **kwargs) -> None:
        super().__init__()

    def extract_job_metrics(self, operationOutput: OperationOutput) -> JobStats:
        inputs: MultiColRenameInput = operationOutput.inputs
        job_stats = JobStats()
        process_stats = operationOutput.processStats
        job_stats.renamed_cols_count = process_stats["renamed_cols_count"]
        job_stats.col_rename_map = operationOutput.metadata
        job_stats.renames_requested = len(inputs.col_rename_list)
        job_stats.renames_sanitized = len(process_stats["sanitized_renames"].keys())

        return job_stats

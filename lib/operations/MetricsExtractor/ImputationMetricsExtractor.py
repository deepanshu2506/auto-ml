from db.models.Dataset import JobStats
from lib.operations.OperationOutput import OperationOutput
from lib.operations.inputTypes import AutoImputationInput, SingleImputationInput
from .MetricsExtractor import DatasetMetricsExtractor, JobMetricsExtractor


class SingleColImputationMetricsExtractor(DatasetMetricsExtractor):
    def __init__(self, *args, **kwargs) -> None:
        super().__init__()

    pass


class SingleColImputationJobMetricsExtractor(JobMetricsExtractor):
    def __init__(self, *args, **kwargs) -> None:
        super().__init__()

    def extract_job_metrics(self, operationOutput: OperationOutput):
        inputs: SingleImputationInput = operationOutput.inputs
        job_stats = JobStats()
        imputed_col_stats = operationOutput.processStats
        job_stats.colsImputed = 1
        job_stats.imputationType = inputs.impute_type.value
        job_stats.cols = imputed_col_stats

        return job_stats


class AutoImputationMetricsExtractor(DatasetMetricsExtractor):
    def __init__(self, *args, **kwargs) -> None:
        super().__init__()


class AutoImputationJobMetricsExtractor(JobMetricsExtractor):
    def __init__(self, *args, **kwargs) -> None:
        super().__init__()

    def extract_job_metrics(self, operationOutput: OperationOutput):
        job_stats = JobStats()
        imputed_col_stats = operationOutput.processStats["affected_col_stats"]
        job_stats.colsImputed = len(imputed_col_stats)
        job_stats.imputationType = operationOutput.processStats["imputer_type"]
        job_stats.cols = imputed_col_stats

        return job_stats

from db.models.Dataset import JobStats
from lib.operations.OperationOutput import OperationOutput
from lib.operations.inputTypes import SingleImputationInput
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

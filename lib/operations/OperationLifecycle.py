from lib.operations.APIOutputBuilder.APIOutputBuilder import APIOutputBuilder
from lib.operations.MetricsExtractor.MetricsExtractor import (
    DatasetMetricsExtractor,
    JobMetricsExtractor,
)
from lib.operations.Processor.BaseProcessor import BaseProcessor
from lib.operations.inputValidator import InputValidator
from utils.enums import JobTypes

from .mapper import (
    jobTypeToInputValidatorMapper,
    jobTypeToProcessorMapper,
    jobTypeToMetricsExtractorMapper,
    jobTypeToJobMetricsExtractorMapper,
    jobTypeToApiOutputExtractorMap,
)


class OperationLifeCycle:
    def __init__(
        self,
        inputValidator: InputValidator,
        processor: BaseProcessor,
        metricsExtractor: DatasetMetricsExtractor,
        jobMetricsExtractor: JobMetricsExtractor,
        apiOutputExtractor: APIOutputBuilder,
    ) -> None:
        self.inputValidator = inputValidator
        self.processor = processor
        self.metricsExtractor = metricsExtractor
        self.jobMetricsExtractor = jobMetricsExtractor
        self.apiOutputExtractor = apiOutputExtractor
        pass

    @staticmethod
    def get_lifecycle_by_jobType(jobType: JobTypes):
        return OperationLifeCycle(
            inputValidator=jobTypeToInputValidatorMapper.get(jobType),
            processor=jobTypeToProcessorMapper.get(jobType),
            metricsExtractor=jobTypeToMetricsExtractorMapper.get(jobType),
            jobMetricsExtractor=jobTypeToJobMetricsExtractorMapper.get(jobType),
            apiOutputExtractor=jobTypeToApiOutputExtractorMap.get(jobType),
        )

    def get_input_validator(self, *args, **kwargs) -> InputValidator:
        return self.inputValidator(*args, **kwargs)

    def get_processor(self, *args, **kwargs) -> BaseProcessor:
        return self.processor(*args, **kwargs)

    def get_metrics_extractor(self, *args, **kwargs) -> DatasetMetricsExtractor:
        return self.metricsExtractor(*args, **kwargs)

    def get_job_metrics_extractor(self, *args, **kwargs) -> JobMetricsExtractor:
        return self.jobMetricsExtractor(*args, **kwargs)

    def get_api_output_extractor(self, *args, **kwargs) -> APIOutputBuilder:
        return self.apiOutputExtractor(*args, **kwargs)

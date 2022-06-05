from datetime import datetime
from typing import List, Tuple
from black import out
from h11 import Data

from pandas import DataFrame
from lib.operations.APIOutputBuilder.APIOutputBuilder import APIOutputBuilder
from lib.operations.MetricsExtractor.MetricsExtractor import (
    DatasetMetricsExtractor,
    JobMetricsExtractor,
)
from lib.operations.OperationLifecycle import OperationLifeCycle
from lib.operations.Processor.BaseProcessor import BaseProcessor
from lib.operations.inputTypes import Input
from lib.operations.inputValidator import InputValidator
from utils.enums import JobTypes
from db.models.Dataset import Dataset, DatasetJob
from lib.operations import OperationOutput
from .FileService import FileService


class OperationsService:
    def __init__(self, fileService: FileService, processor_kwargs) -> None:
        self.fileService = fileService
        self.processor_kwargs = processor_kwargs

    def perform_operation(
        self, dataset: Dataset, jobType: JobTypes, inputs: Input
    ) -> Tuple[dict, OperationOutput, Dataset]:
        lifecycle = OperationLifeCycle.get_lifecycle_by_jobType(jobType)
        job_start_time = datetime.utcnow()
        raw_dataset = self.fileService.get_dataset_from_url(dataset.datasetLocation)
        sanitized_inputs = self.validate_sanitize_inputs(
            lifecycle.get_input_validator(), jobType, inputs
        )
        output = self.process(
            lifecycle.get_processor(**self.processor_kwargs),
            dataset=dataset,
            raw_dataset=raw_dataset,
            jobType=jobType,
            inputs=sanitized_inputs,
        )
        job_end_time = datetime.utcnow()
        feature_metrics = self.extract_feature_metrics(
            lifecycle.get_metrics_extractor(), output
        )
        job_metrics = self.extract_job_metrics(
            lifecycle.get_job_metrics_extractor(), output
        )

        job_metrics.jobStart = job_start_time
        job_metrics.jobEnd = job_end_time

        dataset.datasetFields = feature_metrics

        dataset_job = DatasetJob(jobType=jobType, stats=job_metrics)
        dataset.jobs.append(dataset_job)

        dataset.info = lifecycle.get_metrics_extractor().extract_dataset_metrics(
            output.raw_dataset
        )

        self.persist(dataset, output.raw_dataset)
        api_output = self.build_api_output(lifecycle.get_api_output_extractor(), output)
        return api_output, output, dataset

    def validate_sanitize_inputs(
        self, validator: InputValidator, jobType: JobTypes, inputs: Input
    ):
        print(type(validator))
        return validator.validate(input=inputs)

    def process(
        self,
        processor: BaseProcessor,
        dataset: Dataset,
        raw_dataset: Data,
        jobType: JobTypes,
        inputs: Input,
    ):
        output: OperationOutput = processor.process(
            dataset_meta=dataset, dataset=raw_dataset, jobType=jobType, inputs=inputs
        )
        return output

    def extract_feature_metrics(
        self,
        metricsExtractor: DatasetMetricsExtractor,
        operationOutput: OperationOutput,
    ):
        feature_metrics = metricsExtractor.extract_feature_metrics(
            dataset=operationOutput.raw_dataset,
            dataset_meta=operationOutput.dataset_meta,
            affected_columns=operationOutput.affected_columns,
        )
        return feature_metrics

    def extract_job_metrics(
        self, jobMetricsExtractor: JobMetricsExtractor, operationOutput: OperationOutput
    ):
        return jobMetricsExtractor.extract_job_metrics(operationOutput)

    def build_api_output(
        self, apiOutputBuilder: APIOutputBuilder, operationOutput: OperationOutput
    ):
        api_output = apiOutputBuilder.build_output(operationOutput)
        return api_output

    def persist(self, dataset: Dataset, dataset_raw: DataFrame):
        _, file_size = self.fileService.save_dataset(
            dataset_raw, dataset.datasetLocation
        )
        dataset.info.fileSize = file_size

        dataset.save()

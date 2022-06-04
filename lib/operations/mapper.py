from lib.operations.APIOutputBuilder.ImputationOutputBuilder import (
    SingleColImputationOutputBuilder,
)
from lib.operations.MetricsExtractor.ImputationMetricsExtractor import (
    SingleColImputationJobMetricsExtractor,
    SingleColImputationMetricsExtractor,
)
from lib.operations.Processor.SingleColImputationProcessor import (
    SingleColImputationProcessor,
)
from lib.operations.inputTypes import SingleImputationInput
from lib.operations.inputValidator import SingleImputationInputValidator
from utils.enums import JobTypes

jobTypeToInputValidatorMapper = {
    JobTypes.SINGLE_COL_IMPUTATION: SingleImputationInputValidator
}

jobTypeToProcessorMapper = {
    JobTypes.SINGLE_COL_IMPUTATION: SingleColImputationProcessor
}


jobTypeToMetricsExtractorMapper = {
    JobTypes.SINGLE_COL_IMPUTATION: SingleColImputationMetricsExtractor
}

jobTypeToJobMetricsExtractorMapper = {
    JobTypes.SINGLE_COL_IMPUTATION: SingleColImputationJobMetricsExtractor
}

jobTypeToApiOutputExtractorMap = {
    JobTypes.SINGLE_COL_IMPUTATION: SingleColImputationOutputBuilder
}

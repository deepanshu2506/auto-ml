from lib.operations.APIOutputBuilder.ImputationOutputBuilder import (
    AutoImputationOutputBuilder,
    SingleColImputationOutputBuilder,
)
from lib.operations.MetricsExtractor.ColRenameMetricsExtractor import (
    ColRenameJobMetricsExtractor,
    ColRenameMetricsExtractor,
)
from lib.operations.MetricsExtractor.ImputationMetricsExtractor import (
    AutoImputationJobMetricsExtractor,
    AutoImputationMetricsExtractor,
    SingleColImputationJobMetricsExtractor,
    SingleColImputationMetricsExtractor,
)
from lib.operations.Processor.AutoImputationProcessor import AutoImputationProcessor
from lib.operations.Processor.SingleColImputationProcessor import (
    SingleColImputationProcessor,
)
from lib.operations.inputTypes import SingleImputationInput
from lib.operations.inputValidator import (
    AutoImputationInputValidator,
    ColRenameInputValidator,
    SingleImputationInputValidator,
)
from utils.enums import JobTypes

jobTypeToInputValidatorMapper = {
    JobTypes.SINGLE_COL_IMPUTATION: SingleImputationInputValidator,
    JobTypes.MULTI_COL_IMPUTATION: AutoImputationInputValidator,
    JobTypes.COL_RENAME: ColRenameInputValidator,
}

jobTypeToProcessorMapper = {
    JobTypes.SINGLE_COL_IMPUTATION: SingleColImputationProcessor,
    JobTypes.MULTI_COL_IMPUTATION: AutoImputationProcessor,
}


jobTypeToMetricsExtractorMapper = {
    JobTypes.SINGLE_COL_IMPUTATION: SingleColImputationMetricsExtractor,
    JobTypes.MULTI_COL_IMPUTATION: AutoImputationMetricsExtractor,
    JobTypes.COL_RENAME: ColRenameMetricsExtractor,
}

jobTypeToJobMetricsExtractorMapper = {
    JobTypes.SINGLE_COL_IMPUTATION: SingleColImputationJobMetricsExtractor,
    JobTypes.MULTI_COL_IMPUTATION: AutoImputationJobMetricsExtractor,
    JobTypes.COL_RENAME:ColRenameJobMetricsExtractor
}

jobTypeToApiOutputExtractorMap = {
    JobTypes.SINGLE_COL_IMPUTATION: SingleColImputationOutputBuilder,
    JobTypes.MULTI_COL_IMPUTATION: AutoImputationOutputBuilder,
}

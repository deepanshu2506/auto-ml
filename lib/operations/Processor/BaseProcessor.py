from pandas import DataFrame
from db.models.Dataset import Dataset
from lib.operations.OperationOutput import OperationOutput
from lib.operations.inputTypes import Input
from utils.enums import JobTypes


class BaseProcessor:
    def __init__(self, *args, **kwargs) -> None:
        pass

    def process(
        self,
        dataset_meta: Dataset,
        jobType: JobTypes,
        dataset: DataFrame,
        inputs: Input,
        **kwargs
    ) -> OperationOutput:
        pass

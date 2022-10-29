from typing import List

from pandas import DataFrame

from db.models.Dataset import Dataset
from utils.enums import JobTypes
from .inputTypes import Input


class OperationOutput:
    def __init__(
        self,
        operation_name: JobTypes,
        dataset_meta: Dataset = None,
        raw_dataset: DataFrame = None,
        affected_columns: List[str] = None,
        inputs: Input = None,
        processStats: dict = None,
        metadata: dict = None,
    ) -> None:
        self.operation_name = operation_name
        self.dataset_meta = dataset_meta
        self.raw_dataset = raw_dataset
        self.affected_columns = affected_columns
        self.inputs = inputs
        self.processStats = processStats
        self.metadata = metadata

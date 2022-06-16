from abc import ABC, abstractmethod
import imp

from utils.enums import DatasetOperationStatus
from ..OperationOutput import OperationOutput


class APIOutputBuilder(ABC):
    def build_output(self, operationOutput: OperationOutput) -> dict:
        API_output = {
            "operation": operationOutput.operation_name.value,
            "status": self.get_operation_status(operationOutput),
            **self.get_operation_results(operationOutput),
        }

        return API_output

    @abstractmethod
    def get_operation_results(self, operationOutput: OperationOutput) -> dict:
        pass

    @abstractmethod
    def get_operation_status(self, operationOutput: OperationOutput) -> dict:
        return DatasetOperationStatus.SUCCESS

    def __init__(self) -> None:
        pass

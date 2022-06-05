from abc import ABC, abstractmethod
import imp
from ..OperationOutput import OperationOutput


class APIOutputBuilder(ABC):
    def build_output(self, operationOutput: OperationOutput) -> dict:
        API_output = {
            "operation": operationOutput.operation_name.value,
            **self.get_operation_results(operationOutput),
        }

        return API_output

    @abstractmethod
    def get_operation_results(self, operationOutput: OperationOutput) -> dict:
        pass

    def __init__(self) -> None:
        pass

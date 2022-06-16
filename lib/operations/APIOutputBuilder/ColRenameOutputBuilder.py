from lib.operations.APIOutputBuilder.APIOutputBuilder import APIOutputBuilder
from lib.operations.OperationOutput import OperationOutput
from lib.operations.inputTypes import ColRename, MultiColRenameInput
from utils.enums import DatasetOperationStatus


class ColRenameOutputBuilder(APIOutputBuilder):
    def get_operation_results(self, operationOutput: OperationOutput) -> dict:
        return {**operationOutput.processStats, "renames": operationOutput.metadata}

    def get_operation_status(self, operationOutput: OperationOutput) -> dict:
        inputs: MultiColRenameInput = operationOutput.inputs
        if operationOutput.processStats["cols_renamed_count"] == len(
            inputs.col_rename_list
        ):
            return DatasetOperationStatus.SUCCESS
        elif operationOutput.processStats["cols_renamed_count"] > 0:
            return DatasetOperationStatus.PARTIAL_SUCCESS
        else:
            return DatasetOperationStatus.FAILED

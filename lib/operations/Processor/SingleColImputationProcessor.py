from webbrowser import Opera
from pandas import DataFrame
from db.models.Dataset import Dataset
from lib.imputer import Imputer, ImputerFactory
from lib.operations.OperationOutput import OperationOutput
from lib.operations.inputTypes import SingleImputationInput
from utils.enums import JobTypes
from .BaseProcessor import BaseProcessor


class SingleColImputationProcessor(BaseProcessor):
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)

    def process(
        self,
        dataset_meta: Dataset,
        jobType: JobTypes,
        dataset: DataFrame,
        inputs: SingleImputationInput,
    ) -> OperationOutput:

        output = OperationOutput(
            operation_name=jobType, inputs=inputs, dataset_meta=dataset_meta
        )
        null_count = int(dataset[inputs.col_name].isnull().sum())
        affected_columns = []
        if null_count == 0:
            output.raw_dataset = dataset
            return output
        else:
            imputer: Imputer = ImputerFactory.get_imputer(
                inputs.impute_type,
                dataset=dataset,
                column_name=inputs.col_name,
                value=inputs.value,
            )
            imputed_dataset = imputer.impute(dataset)
            affected_columns.append(inputs.col_name)
            output.raw_dataset = imputed_dataset

        output.affected_columns = affected_columns

        process_stats = [
            {
                "col_name": inputs.col_name,
                "imputed_count": null_count,
            }
        ]

        output.processStats = process_stats
        return output

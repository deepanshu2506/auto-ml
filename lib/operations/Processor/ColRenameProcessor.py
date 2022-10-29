from os import rename
import re
from typing import List
from numpy import append
from pandas import DataFrame
from regex import Regex
from db.models.Dataset import Dataset
from lib.operations.OperationOutput import OperationOutput
from lib.operations.Processor.BaseProcessor import BaseProcessor
from lib.operations.inputTypes import ColRename, Input, MultiColRenameInput
from utils.enums import JobTypes


class ColRenameProcessor(BaseProcessor):
    def __init__(self, *args, **kwargs) -> None:
        pass

    def rename_cols(self, raw_dataset, rename_mapper):
        renamed_df = raw_dataset.rename(
            columns=rename_mapper,
            errors="raise",
        )
        return renamed_df

    def _get_valid_cols(
        self, dataset_columns, rename_cols: List[ColRename]
    ) -> List[ColRename]:
        valid_cols = filter(lambda col: col.col_name in dataset_columns, rename_cols)

        return list(valid_cols)

    def _get_safe_cols(self, rename_cols: List[ColRename]) -> List[ColRename]:
        safe_cols_regex = Regex("[A-Za-z0-9_-\s]+")
        safe_cols = filter(
            lambda x: safe_cols_regex.fullmatch(x.target_col_name) is not None,
            rename_cols,
        )
        return list(safe_cols)

    def process(
        self,
        dataset_meta: Dataset,
        jobType: JobTypes,
        dataset: DataFrame,
        inputs: MultiColRenameInput,
        **kwargs
    ) -> OperationOutput:
        valid_cols = self._get_valid_cols(
            dataset.columns.tolist(), inputs.col_rename_list
        )
        cols_safe_to_rename = self._get_safe_cols(valid_cols)

        sanitized_cols = []
        cols_without_sanity = []
        for col in cols_safe_to_rename:
            if " " in col.target_col_name:
                col.target_col_name = col.target_col_name.replace(" ", "_")
                cols_without_sanity.append(col)

            sanitized_cols.append(col)
        rename_map = {col.col_name: col.target_col_name for col in sanitized_cols}
        renamed_df = self.rename_cols(
            raw_dataset=dataset,
            rename_mapper=rename_map,
        )

        invalid_cols = list(
            set(map(lambda x: x.col_name, inputs.col_rename_list))
            - set(map(lambda x: x.col_name, valid_cols))
        )
        unsafe_cols = list(
            set(map(lambda x: x.col_name, valid_cols))
            - set(map(lambda x: x.col_name, cols_safe_to_rename))
        )

        process_stats = {
            "cols_renamed_count": len(sanitized_cols),
            "invalid_cols": invalid_cols,
            "invalid_renames": unsafe_cols,
            "sanitized_renames": {
                x.col_name: x.target_col_name for x in cols_without_sanity
            },
        }

        output = OperationOutput(
            operation_name=jobType,
            inputs=inputs,
            dataset_meta=dataset_meta,
            raw_dataset=renamed_df,
            processStats=process_stats,
            affected_columns=rename_map.keys(),
            metadata=rename_map,
        )
        return output

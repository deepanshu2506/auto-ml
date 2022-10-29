import string
from typing import List
from utils.enums import ImputationMethods


class Input:
    def from_dict(dict):
        pass


class SingleImputationInput(Input):
    def __init__(self, col_name, impute_type: ImputationMethods, value=None) -> None:
        super().__init__()
        self.col_name = col_name
        self.impute_type = impute_type
        self.value = value

    @staticmethod
    def get_validation_schema():
        return {
            "col_name": {"required": True},
            "impute_type": {
                "required": True,
            },
            "value": {"nullable": True},
        }

    @staticmethod
    def from_dict(dict):
        input = SingleImputationInput(**dict)
        return input


class AutoImputationInput(Input):
    def __init__(self, target_col_name: str) -> None:
        super().__init__()
        self.target_col_name = target_col_name

    @staticmethod
    def get_validation_schema():
        return {
            "target_col_name": {"required": True},
        }

    @staticmethod
    def from_dict(dict):
        input = AutoImputationInput(**dict)
        return input


class ColRename(Input):
    def __init__(self, col_name: str, target_col_name):
        super().__init__()
        self.col_name = col_name
        self.target_col_name = target_col_name

    @staticmethod
    def get_validation_schema():
        return {
            "target_col_name": {"required": True, "type": "string"},
            "col_name": {"required": True, "type": "string"},
        }

    @staticmethod
    def from_dict(dict):
        input = ColRename(**dict)


class MultiColRenameInput(Input):
    def __init__(self, col_rename_list: List[ColRename]) -> None:
        self.col_rename_list = col_rename_list

    @staticmethod
    def get_validation_schema():
        return {
            "col_rename_list": {
                "type": "list",
                "schema": {
                    "type": "dict",
                    "schema": ColRename.get_validation_schema(),
                },
            },
        }

    @staticmethod
    def from_dict(dict):
        col_rename_list = list(
            map(lambda x: ColRename.from_dict(x), dict["col_rename_list"])
        )
        return MultiColRenameInput(col_rename_list=col_rename_list)

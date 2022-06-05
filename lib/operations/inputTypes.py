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

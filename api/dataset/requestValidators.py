from utils.enums import ImputationMethods


def SingleColImputerValidator(
    col_name: str, impute_type: ImputationMethods, value=None, **kwargs
):
    if impute_type is not ImputationMethods.VALUE and value is not None:
        raise ValueError({"value"})

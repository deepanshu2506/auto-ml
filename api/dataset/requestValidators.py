from utils.enums import SingleColImputationMethods


def SingleColImputerValidator(
    col_name: str, impute_type: SingleColImputationMethods, value=None, **kwargs
):
    if impute_type is not SingleColImputationMethods.VALUE and value is not None:
        raise ValueError({"value"})

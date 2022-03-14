from enum import Enum
import re
from typing import List
from utils.exceptions import APIInputValidationError
from cerberus import Validator


def password_validator(value: str):
    match = re.match(
        "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})", value
    )
    if not match:
        raise APIInputValidationError("Password not valid")
    return value


def enum_validator(enumType: Enum):
    def validator(value, name):
        try:
            return enumType(value)
        except KeyError:
            raise ValueError(f"invalid value for field {name}")

    return validator


def _build_error(errors: dict, idx):
    field, error = list(errors.items())[0]
    return f"{field} : {','.join(error)} in object_id : {idx}"


def nested_list(schema: dict):
    def validator(value, name=None):
        if type(value) is not list:
            raise ValueError(f"invalid type of value for field {name}")

        schema_validator = Validator(schema)
        for idx, val in enumerate(value):
            if not schema_validator.validate(val):
                error = _build_error(schema_validator.errors, idx)
                raise ValueError(error)
        return value

    return validator

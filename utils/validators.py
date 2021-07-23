from enum import Enum
import functools
import re
from utils.exceptions import APIInputValidationError


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

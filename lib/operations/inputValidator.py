from abc import ABC, abstractmethod
from cerberus import Validator
from lib.operations.inputTypes import (
    AutoImputationInput,
    MultiColRenameInput,
    SingleImputationInput,
)
from utils.exceptions import APIInputValidationError


class InputValidator(ABC):
    def __init__(self, schema: dict) -> None:
        self.schema = schema
        self.schema_validator: Validator = Validator(
            schema,
        )

    def _build_error(self, errors: dict):
        field, error = list(errors.items())[0]
        return f"{field} : {','.join(error)}"

    @abstractmethod
    def to_obj(self, input):
        pass

    def validate(self, input):
        if not self.schema_validator.validate(input):
            error = self._build_error(self.schema_validator.errors)
            raise APIInputValidationError(error)
        return self.to_obj(self.schema_validator.normalized(input))


class SingleImputationInputValidator(InputValidator):
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(SingleImputationInput.get_validation_schema())

    def to_obj(self, input) -> SingleImputationInput:
        return SingleImputationInput.from_dict(input)


class AutoImputationInputValidator(InputValidator):
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(AutoImputationInput.get_validation_schema())

    def to_obj(self, input) -> AutoImputationInput:
        return AutoImputationInput.from_dict(input)


class ColRenameInputValidator(InputValidator):
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(MultiColRenameInput.get_validation_schema())

    def to_obj(self, input) -> MultiColRenameInput:
        return MultiColRenameInput.from_dict(input)

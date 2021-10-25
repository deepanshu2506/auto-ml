from flask import jsonify


class APIInputValidationError(Exception):
    def __init__(self, message):
        super().__init__(message)


class APIError(Exception):
    def __init__(self, data=None, *args: object) -> None:
        self.data = data
        super().__init__(*args)

    pass


class UserExistsError(APIError):
    description = "User already Exists"
    code = 422


class DatasetNotFound(APIError):
    description = "Dataset Not found"
    code = 404


class ModelSelectionJobNotFound(APIError):
    description = "Model Selection Job Not found"
    code = 404


class ModelNotFound(APIError):
    description = "Model Not found"
    code = 404


class InvalidInputFormatForModelError(APIError):
    description = "input is not well formed according to the model"
    code = 400


class UnimputedDatasetError(APIError):
    code = 400
    description = "Dataset has null values"

    def __init__(self, data=None, *args: object) -> None:
        super().__init__(data=data, *args)


def handle_exception(err):
    """Return custom JSON when APIError or its children are raised"""
    response = {"error": err.description}
    if err.data:
        response["data"] = err.data
    return jsonify(response), err.code

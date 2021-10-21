from flask_restful import HTTPException


class APIInputValidationError(Exception):
    def __init__(self, message):
        super().__init__(message)


class UserExistsError(HTTPException):
    pass


class DatasetNotFound(HTTPException):
    pass


class ModelSelectionJobNotFound(HTTPException):
    pass


class ModelNotFound(HTTPException):
    pass


class InsufficientPrivilegesError(HTTPException):
    pass


class InvalidInputFormatForModelError(HTTPException):
    pass


RestfulErrors = {
    "UserExistsError": {
        "message": "User already Exists",
        "status": 422,
    },
    "DatasetNotFound": {
        "message": "Dataset Not found",
        "status": 404,
    },
    "ModelSelectionJobNotFound": {
        "message": "Model Selection Job Not found",
        "status": 404,
    },
    "ModelNotFound": {
        "message": "Model Not found",
        "status": 404,
    },
    "InvalidInputFormatForModelError": {
        "message": "input is not well formed according to the model",
        "status": 400,
    },
}

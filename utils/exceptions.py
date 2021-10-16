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

class InsufficientPrivilegesError(HTTPException):
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
}

from flask_restful import HTTPException


class APIInputValidationError(Exception):
      def __init__(self,message):
          super().__init__(message)






class UserExistsError(HTTPException):
    pass


RestfulErrors={
    "UserExistsError":{
        'message': "User already Exists",
        'status': 422,
    }
}
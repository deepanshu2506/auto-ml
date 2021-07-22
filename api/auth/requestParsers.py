from utils.validators import password_validator
from flask_restful import Resource, reqparse


UserRegistrationAPIRequestParser = reqparse.RequestParser()
UserRegistrationAPIRequestParser.add_argument(
    "username", type=str, required=True, help="username is required"
)
UserRegistrationAPIRequestParser.add_argument(
    "password", type=password_validator, required=True
)
UserRegistrationAPIRequestParser.add_argument("email", type=str, required=True)


UserLoginAPIRequestParser = reqparse.RequestParser()
UserLoginAPIRequestParser.add_argument("email", type=str, required=True)
UserLoginAPIRequestParser.add_argument("password", type=str, required=True)

from api.auth.responseTypes import UserLoginAPIResponse
from utils.exceptions import UserExistsError
from flask.wrappers import Response
from api.auth.requestParsers import (
    UserLoginAPIRequestParser,
    UserRegistrationAPIRequestParser,
)
import datetime
from flask_jwt_extended import create_access_token
from flask_restful import Resource, marshal_with
from db.models.User import User
from flask import request


class UserRegistrationAPI(Resource):
    def post(self):
        body = UserRegistrationAPIRequestParser.parse_args()
        existingUser = User.objects(email=body["email"])
        if existingUser:
            return {"error": "User already exists!"}, 422
        user = User(**body).save()
        user.hash_password()
        user.save()
        return Response(status=201)


class loginAPI(Resource):
    @marshal_with(UserLoginAPIResponse)
    def post(self):
        body = UserLoginAPIRequestParser.parse_args()
        try:
            user=User.objects.get(email=body.get("email"))
        except:
            return {"error": "Email or password invalid"}, 401
        authorized = user.check_password(body.get("password"))
        print(authorized)
        if not authorized:
            return {"error": "Email or password invalid"}, 401
        
        expires = datetime.timedelta(days=7)
        access_token = create_access_token(identity=str(user.id), expires_delta=expires)
        return {"token": access_token, "profile": user}, 200

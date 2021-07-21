
from utils.exceptions import UserExistsError
from flask.wrappers import Response
from api.auth.requestParsers import UserRegistrationAPIRequestParser
import datetime
from flask_jwt_extended import create_access_token
from flask_restful import Resource
from db.models.User import User
from flask import request



class UserRegistrationAPI(Resource):
    def handle_error(self,e):
        print("-----------here------------------")
    def post(self):
        body = UserRegistrationAPIRequestParser.parse_args()
        existingUser = User.objects(email=body['email'])
        if existingUser: 
            print("here")
            raise UserExistsError
        user = User(**body).save()
        user.hash_password()
        user.save()
        return Response(status=201)
     




class loginAPI(Resource):
    def post(self):
        body = request.get_json()
        user = User.objects.get(email=body.get('email'))
        authorized = user.check_password(body.get('password'))
        if not authorized:
            return {'error': 'Email or password invalid'}, 401
 
        expires = datetime.timedelta(days=7)
        access_token = create_access_token(identity=str(user.id), expires_delta=expires)
        return {'token': access_token}, 200
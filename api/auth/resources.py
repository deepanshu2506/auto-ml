from api.auth.responseTypes import UserLoginAPIResponse,EmailConfirmAPIResponse
from utils.exceptions import UserExistsError
from utils.email import send_email
from flask.wrappers import Response
from api.auth.requestParsers import (
    UserLoginAPIRequestParser,
    UserRegistrationAPIRequestParser
)
import datetime
from flask_jwt_extended import create_access_token
from flask_restful import Resource, marshal_with
from db.models.User import User
from flask import request,render_template,make_response
from services.AuthService import AuthService
from flask import flash, redirect, url_for
from flask import current_app as app



class UserRegistrationAPI(Resource):
    def __init__(self, authService: AuthService) -> None:
        super().__init__()
        self.authService = authService
        
      
    def post(self):
        body = UserRegistrationAPIRequestParser.parse_args()
        user_email=body["email"]
        existingUser = User.objects(email=user_email)
        if existingUser:
            return {"error": "User already exists!"}, 422
        token = self.authService.generate_confirmation_token(user_email)
        # with app.test_request_context():
        #     confirm_url = url_for('user.confirm_email',token=token, _external=True)
        confirm_url='http://localhost:5000/auth/confirm_email/'+token
        mail_body="Welcome! Thanks for signing up. Please follow this link to activate your account: "+ confirm_url
        html = render_template('user_activate.html', confirm_url=confirm_url)
        subject = "Please confirm your email"
        send_email(user_email, subject, html)
        user = User(**body).save()
        user.hash_password()
        user.save()
        return { "msg": "A confirmation email has been sent via email."}, 201

class ConfirmEmailAPI(Resource):
    def __init__(self, authService: AuthService) -> None:
        super().__init__()
        self.authService = authService
     
    def get(self,token):      
        try:
            email = self.authService.confirm_token(token)
            print(email)
        except:
            print('The confirmation link is invalid or has expired.', 'danger')
            return Response(response=render_template('confirm_email_fail.html'),status=401,mimetype='text/html')
        users =  User.objects(email=email)
        user=users[0]
        print(user)
        if user.confirmed:
            print('Account already confirmed. Please login.', 'success')
            return Response(response=render_template('confirm_email.html'),status=200,mimetype='text/html')
        else:
            user.confirmed = True
            user.confirmedOn = datetime.datetime.utcnow()
            user.save()
            print('You have confirmed your account. Thanks!', 'success')
        # return { "profile": user}, 200
        return Response(response=render_template('confirm_email.html'),status=200,mimetype='text/html')
     


class loginAPI(Resource):
    @marshal_with(UserLoginAPIResponse)
    def post(self):
        body = UserLoginAPIRequestParser.parse_args()
        try:
            user=User.objects.get(email=body.get("email"))
            print(user)
        except:
            return {"error": "Email or password invalid"}, 401
        authorized = user.check_password(body.get("password"))
        print(authorized)
        if not authorized:
            return {"error": "Email or password invalid"}, 401
        try:
            print(user.confirmed)
            if not user.confirmed:
                return {"error": "Email is not verified"}, 403
        except:
                return {"error": "Email is not verified"}, 403
            
        expires = datetime.timedelta(days=7)
        access_token = create_access_token(identity=str(user.id), expires_delta=expires)
        return {"token": access_token, "profile": user}, 200

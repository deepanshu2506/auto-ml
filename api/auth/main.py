from api.auth.resources import UserRegistrationAPI, loginAPI , ConfirmEmailAPI
from flask_restful import Api
from services.AuthService import AuthService

API_PREFIX:str = "/auth"
def initialize(api:Api)->None:
    authService=AuthService()
    api.add_resource(
        UserRegistrationAPI,
        f'{API_PREFIX}/register',
        resource_class_kwargs={"authService": authService},
    )
    api.add_resource(loginAPI, f'{API_PREFIX}/login')
    api.add_resource(
        ConfirmEmailAPI,
        f'{API_PREFIX}/confirm_email/<token>',
        resource_class_kwargs={"authService": authService},
    )
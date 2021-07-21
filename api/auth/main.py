from api.auth.resources import UserRegistrationAPI, loginAPI
from flask_restful import Api


API_PREFIX:str = "/auth"
def initialize(api:Api)->None:
    api.add_resource(UserRegistrationAPI,f'{API_PREFIX}/register')
    api.add_resource(loginAPI, f'{API_PREFIX}/login')
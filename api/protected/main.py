from api.protected.resources import ProtectedAPI
from flask_restful import Api


API_PREFIX:str = "/protected"
def initialize(api:Api)->None:
    api.add_resource(ProtectedAPI,f'{API_PREFIX}/')

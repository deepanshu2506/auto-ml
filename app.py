from utils.exceptions import RestfulErrors
from api.registerAPIs import register
from config import Config
from db.init import DBUtils
from flask import Flask
from flask_restful import Api
from flask_jwt_extended import JWTManager

app = Flask(__name__)

app.config.from_object(Config)

api = Api(app,errors=RestfulErrors)
DBUtils.init()
jwt = JWTManager(app)

register(api)
print("Service listening")




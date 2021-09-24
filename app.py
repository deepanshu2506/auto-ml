from api.websocket.setup import SocketServer, setup_events
from os import name
from utils.exceptions import RestfulErrors
from api.registerAPIs import register
from config import Config
from db.init import DBUtils
from flask import Flask
from flask_restful import Api
from flask_jwt_extended import JWTManager

app = Flask(__name__)

app.config.from_object(Config)
print("here")
api = Api(app, errors=RestfulErrors)
DBUtils.init()
jwt = JWTManager(app)

socketio = SocketServer.create_socket_server(app, cors_allowed_origins="*")
socketio.run(app)
setup_events()

print("socket listening")

register(api)
print("Service listening")

from api.websocket.setup import SocketServer, setup_events
from os import name
from utils.exceptions import APIError, handle_exception
from api.registerAPIs import register
from config import Config
from db.init import DBUtils
from flask import Flask
from flask_restful import Api
from flask_jwt_extended import JWTManager
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.errorhandler(APIError)
def handle_API_errors(e):
    return handle_exception(e)


app.config.from_object(Config)
print("here")
api = Api(app)
DBUtils.init()
jwt = JWTManager(app)

socketio = SocketServer.create_socket_server(app, cors_allowed_origins="*")
socketio.run(app)
setup_events()

print("socket listening")

register(api)
print("Service listening")

if __name__ == "__main__":
    app.run(debug=True)

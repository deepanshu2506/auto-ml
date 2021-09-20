from api.websocket.ClientCache import cache
from lib.cache.InMemoryCache import InMemoryCache
from flask_jwt_extended.utils import get_jwt_identity
from flask_jwt_extended.view_decorators import jwt_required
from api.websocket.setup import SocketServer
from flask import request

socketio = SocketServer.get_socket_server()


@socketio.on("connect")
@jwt_required()
def on_connect(auth_data):
    sid = request.sid
    client_id = get_jwt_identity()
    cache.on_connect(sid, client_id)


@socketio.on("disconnect")
def test_disconnect():
    sid = request.sid
    print(sid)
    cache.on_disconnect(sid)

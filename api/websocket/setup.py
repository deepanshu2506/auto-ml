from flask_socketio import SocketIO


class SocketInitializer:
    def __init__(self) -> None:
        self.socketio = None

    def create_socket_server(self, app, **kwargs) -> SocketIO:
        print("here creating socekt server")
        self.socketio = SocketIO(app, **kwargs)
        return self.socketio

    def get_socket_server(self) -> SocketIO:
        if self.socketio != None:
            return self.socketio
        raise TypeError("Socket server is not initialized")


SocketServer = SocketInitializer()


def setup_events():
    import api.websocket.auth_events

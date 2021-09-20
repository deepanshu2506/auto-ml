from lib.Logger.Logger import Logger
from api.websocket.ClientCache import cache as socket_client_cache
from enum import Enum
from datetime import datetime
from flask_socketio import emit


class LogLevels(Enum):
    INFO = "INFO"
    WARN = "WARN"
    ERROR = "ERROR"


class SocketLogger(Logger):
    def __init__(self, client_id, event="log") -> None:
        self.client_id = client_id
        self.event = event
        pass

    def send_to_client(
        self,
        message,
        log_level: LogLevels = LogLevels.INFO,
    ):
        log = {
            "log_level": log_level.value,
            "timestamp": datetime.now(),
            "message": message,
        }
        sid = socket_client_cache.get_socket_id(self.client_id)
        if sid:
            emit(self.event, log, room=sid)
        else:
            # TODO - Handle logs when socket is not connected
            pass

    def info(self, message):
        self.send_to_client(
            message,
            log_level=LogLevels.INFO,
        )

    def warn(self, message):
        self.send_to_client(message, log_level=LogLevels.WARN)

    def error(self, message):
        self.send_to_client(message, log_level=LogLevels.ERROR)

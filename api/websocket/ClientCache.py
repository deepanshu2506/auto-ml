from lib.cache.InMemoryCache import InMemoryCache


class ClientCache:
    def __init__(self) -> None:
        self.sid_to_id = InMemoryCache[str, str]()
        self.id_to_sid = InMemoryCache[str, str]()

    def on_connect(self, sid: str, id: str):
        self.sid_to_id.set(sid, id)
        self.id_to_sid.set(id, sid)

    def get_client_id(self, sid: str) -> str:
        return self.sid_to_id.get(sid)

    def get_socket_id(self, client_id: str) -> str:
        return self.id_to_sid.get(client_id)

    def on_disconnect(self, sid: str):
        id = self.sid_to_id.unset(sid)
        self.id_to_sid.unset(id)


cache = ClientCache()

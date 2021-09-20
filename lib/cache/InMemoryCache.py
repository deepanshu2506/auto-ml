from typing import Dict, Generic, TypeVar

K = TypeVar("K")
V = TypeVar("V")


class InMemoryCache(Generic[K, V]):
    def __init__(self) -> None:
        self.cache: Dict[K, V] = {}

    def set(self, key: K, value: V):
        self.cache[key] = value

    def get(self, key: K) -> V:
        return self.cache.get(key , None)

    def unset(self,key:K)->V:
        return self.cache.pop(key,None)

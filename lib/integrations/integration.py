from typing import Tuple

from pandas.core.frame import DataFrame
from db.models.Dataset import DataSourceProperties


class Integration:
    def __init__(self, host, port, user, password, **kwargs) -> None:
        self.host = host
        self.port = port
        self.user = user
        self.password = password
        pass

    def get_connection(self):
        raise NotImplementedError

    def create_dataset(self, query)->DataFrame:
        raise NotImplementedError

    def _query(self, query, fetch=False):
        raise NotImplementedError

    def get_datasource_properties(self) -> DataSourceProperties:
        raise NotImplementedError

    def check_connection(self)->Tuple:
        raise NotImplementedError
    
    def preview_dataset(self,query,limit)->DataFrame:
        raise NotImplementedError
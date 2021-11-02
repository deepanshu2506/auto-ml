from mongoengine.queryset.transform import query
from pandas.core.frame import DataFrame

from db.models.Dataset import DataSourceProperties
from .integration import Integration
import mysql.connector


class MySqlIntegration(Integration):
    def __init__(self, host, port, user, password, **kwargs) -> None:
        super().__init__(host, port, user, password, **kwargs)
        self.database = kwargs.get("database")

    def get_connection(self):
        config = {
            "host": self.host,
            "port": self.port,
            "user": self.user,
            "password": self.password,
            "database": self.database,
        }
        # if self.ssl is True:
        #     config["client_flags"] = [mysql.connector.constants.ClientFlag.SSL]
        #     if self.ssl_ca is not None:
        #         config["ssl_ca"] = self.ssl_ca
        #     if self.ssl_cert is not None:
        #         config["ssl_cert"] = self.ssl_cert
        #     if self.ssl_key is not None:
        #         config["ssl_key"] = self.ssl_key
        return mysql.connector.connect(**config)

    def check_connection(self):
        error = None
        try:
            con = self.get_connection()
            connected = con.is_connected()
            con.close()
        except Exception as e:
            connected = False
            error = e
        return connected, error

    def _query(self, query):
        con = self.get_connection()

        cur = con.cursor(dictionary=True, buffered=True)
        cur.execute(query)
        res = True
        try:
            res = cur.fetchall()
        except Exception:
            pass
        con.commit()
        con.close()
        return res

    def create_dataset(self, query) -> DataFrame:
        self.query = query
        raw_data = self._query(query)
        dataset = DataFrame(raw_data)
        return dataset

    def get_datasource_properties(self) -> DataSourceProperties:
        if self.query:
            properties = DataSourceProperties(
                host=self.host,
                port=self.port,
                user=self.user,
                password=self.password,
                query=self.query,
            )
            return properties
        else:
            raise RuntimeError("Dataset is not yet created")

    def preview_dataset(self, query, limit) -> DataFrame:
        q = f"""SELECT * FROM ({query}) as dataset LIMIT {limit}"""
        return self.create_dataset(q)

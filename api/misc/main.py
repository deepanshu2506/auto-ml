from api.dataset.resources import DataSetsAPI
from flask_restful import Api

from api.misc.resources import DbConnectionCheckerAPI


API_PREFIX: str = "/misc"


def initialize(api: Api) -> None:
    api.add_resource(
        DbConnectionCheckerAPI,
        f"{API_PREFIX}/checkDBConn",
        resource_class_kwargs={},
    )

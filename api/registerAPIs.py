import api.auth.main as authAPI
import api.protected.main as protectedAPI
import api.dataset.main as DatasetAPI
from flask_restful import Api


def register(api: Api) -> None:
    authAPI.initialize(api)
    protectedAPI.initialize(api)
    DatasetAPI.initialize(api)

import api.auth.main as authAPI
import api.protected.main as protectedAPI
import api.dataset.main as DatasetAPI
import api.ModelSelection.main as ModelSelectionAPI
import api.misc.main as miscAPIs
import api.saved_model.main as savedModelAPI
from flask_restful import Api


def register(api: Api) -> None:
    authAPI.initialize(api)
    protectedAPI.initialize(api)
    DatasetAPI.initialize(api)
    ModelSelectionAPI.initialize(api)
    miscAPIs.initialize(api)
    savedModelAPI.initialize(api)

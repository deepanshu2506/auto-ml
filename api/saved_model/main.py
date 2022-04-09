from flask_restful import Api
from api.saved_model.resources import (
    ExportSavedModelAPI,
    GetSavedModelsAPI,
    InferenceAPI,
    SavedModelByIdAPI,
)
from services import FileService, SavedModelService

API_PREFIX: str = "/saved_model"


def initialize(api: Api) -> None:
    fileService = FileService()
    savedModelService = SavedModelService(fileService=fileService)

    api.add_resource(
        ExportSavedModelAPI,
        f"{API_PREFIX}/<saved_model_id>/export",
        resource_class_kwargs={"savedModelService": savedModelService},
    )

    api.add_resource(
        InferenceAPI,
        f"{API_PREFIX}/<saved_model_id>/infer",
        resource_class_kwargs={"savedModelService": savedModelService},
    )

    api.add_resource(
        GetSavedModelsAPI,
        f"{API_PREFIX}/",
        resource_class_kwargs={"savedModelService": savedModelService},
    )
    api.add_resource(
        SavedModelByIdAPI,
        f"{API_PREFIX}/<saved_model_id>",
        resource_class_kwargs={"savedModelService": savedModelService},
    )

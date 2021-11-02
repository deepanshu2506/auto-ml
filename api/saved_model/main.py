
from flask_restful import Api
from api.saved_model.resources import InferenceAPI
from services import FileService,SavedModelService

API_PREFIX: str = "/saved_model"

def initialize(api: Api) -> None:
    fileService = FileService()
    savedModelService = SavedModelService(fileService=fileService)
    
    
    api.add_resource(
        InferenceAPI,
        f"{API_PREFIX}/<saved_model_id>/infer",
        resource_class_kwargs={"savedModelService": savedModelService},
    )

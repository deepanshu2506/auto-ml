from api.ModelSelection.resources import ModelSelectionResource
from services.ModelGeneratorService import ModelGeneratorService
from services.DatasetService import DatasetService
from services.FileService import FileService

from flask_restful import Api


API_PREFIX: str = "/dataset/model_selection"


def initialize(api: Api) -> None:
    fileService = FileService()
    datasetService = DatasetService(fileService=fileService)
    modelGeneratorService = ModelGeneratorService(
        fileService=fileService, datasetService=datasetService
    )
    api.add_resource(
        ModelSelectionResource,
        f"{API_PREFIX}/",
        resource_class_kwargs={"modelGenerationService": modelGeneratorService},
    )

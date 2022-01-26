from flask_restful import Api
from api.visualization.resources import AutoVisualizationAPI, VisualizationByColumnsAPI
from services import FileService, DatasetService
from services.VisualizationService import VisualizationService

API_PREFIX: str = "/visualization"


def initialize(api: Api) -> None:
    fileService = FileService()
    datasetService = DatasetService(fileService=fileService)
    visualizationService = VisualizationService(
        fileService=fileService, datasetService=datasetService
    )
    api.add_resource(
        AutoVisualizationAPI,
        f"{API_PREFIX}/<dataset_id>/",
        resource_class_kwargs={"visualizationService": visualizationService},
    )
    api.add_resource(
        VisualizationByColumnsAPI,
        f"{API_PREFIX}/columns/<dataset_id>/",
        resource_class_kwargs={"visualizationService": visualizationService},
    )

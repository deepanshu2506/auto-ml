from flask_restful import Api
from api.visualization.resources import AutoVisualizationAPI,CorrelationAPI
from services import FileService, DatasetService
from services.VisualizationService import VisualizationService

API_PREFIX: str = "/datasets"


def initialize(api: Api) -> None:
    fileService = FileService()
    datasetService = DatasetService(fileService=fileService)
    visualizationService = VisualizationService(
        fileService=fileService, datasetService=datasetService
    )
    api.add_resource(
        AutoVisualizationAPI,
        f"{API_PREFIX}/<dataset_id>/visualization",
        resource_class_kwargs={"visualizationService": visualizationService},
    )
    api.add_resource(
        CorrelationAPI,
        f"{API_PREFIX}/<dataset_id>/correlate",
        resource_class_kwargs={"visualizationService": visualizationService},
    )


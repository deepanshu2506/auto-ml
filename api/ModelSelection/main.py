from api.ModelSelection.resources import (
    ExportGeneratedModelResource,
    ModelSelectionJobResource,
    ModelSelectionResource,
)
from services.ModelGeneratorService import ModelGeneratorService
from services.DatasetService import DatasetService
from services.FileService import FileService

from flask_restful import Api

from services.ModelSelectionJobService import ModelSelectionJobService
from services.SavedModelService import SavedModelService


API_PREFIX: str = "/dataset/model_selection"


def initialize(api: Api) -> None:
    fileService = FileService()
    datasetService = DatasetService(fileService=fileService)
    modelGeneratorService = ModelGeneratorService(
        fileService=fileService, datasetService=datasetService
    )
    modelSelectionJobService = ModelSelectionJobService()
    savedModelService = SavedModelService(fileService=fileService)
    
    api.add_resource(
        ModelSelectionResource,
        f"{API_PREFIX}/",
        resource_class_kwargs={"modelGenerationService": modelGeneratorService},
    )
    api.add_resource(
        ModelSelectionJobResource,
        f"{API_PREFIX}/<model_selection_job_id>",
        resource_class_kwargs={
            "modelGenerationService": modelGeneratorService,
            "modelSelectionJobService": modelSelectionJobService,
        },
    )

    api.add_resource(
        ExportGeneratedModelResource,
        f"{API_PREFIX}/<model_selection_job_id>/export/<model_id>",
        resource_class_kwargs={
            "modelGenerationService": modelGeneratorService,
            "modelSelectionJobService": modelSelectionJobService,
        },
    )
 
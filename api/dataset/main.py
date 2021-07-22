from services.DatasetService import DatasetService
from services.FileService import FileService, MockFileService
from api.dataset.resources import DataSetsAPI
from flask_restful import Api


API_PREFIX: str = "/datasets"


def initialize(api: Api) -> None:
    api.add_resource(
        DataSetsAPI,
        f"{API_PREFIX}/",
        resource_class_kwargs={
            "datasetService": DatasetService(fileService=MockFileService()),
        },
    )

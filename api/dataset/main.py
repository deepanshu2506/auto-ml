from api.dataset.imputationResources import DatasetSingleColImputation
from services.DatasetService import DatasetService
from services.FileService import FileService, MockFileService
from api.dataset.resources import (
    DataSetsAPI,
    DatasetAPI,
    DatasetColDetailsAPI,
    PerformAggregationAPI,
)
from flask_restful import Api


API_PREFIX: str = "/datasets"


def initialize(api: Api) -> None:
    datasetService = DatasetService(fileService=FileService())
    api.add_resource(
        DataSetsAPI,
        f"{API_PREFIX}/",
        resource_class_kwargs={"datasetService": datasetService},
    )

    api.add_resource(
        DatasetAPI,
        f"{API_PREFIX}/<id>",
        resource_class_kwargs={"datasetService": datasetService},
    )

    api.add_resource(
        PerformAggregationAPI,
        f"{API_PREFIX}/<id>/perform_aggregation",
        resource_class_kwargs={"datasetService": datasetService},
    )
    api.add_resource(
        DatasetColDetailsAPI,
        f"{API_PREFIX}/<id>/col_details",
        resource_class_kwargs={"datasetService": datasetService},
    )
    api.add_resource(
        DatasetSingleColImputation,
        f"{API_PREFIX}/<id>/impute_advanced",
        resource_class_kwargs={"datasetService": datasetService},
    )

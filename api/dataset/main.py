from api.dataset.imputationResources import (
    DatasetSingleColImputation,
    DatasetAutoImputation,
)
from services.DatasetService import DatasetService
from services.ImputationService import ImputationService
from services.FileService import FileService, MockFileService
from api.dataset.resources import (
    DataSetsAPI,
    DatasetAPI,
    DatasetColumnDescriptionAPI,
    DatasetPreviewAPI,
    DatasetColDetailsAPI,
    PerformAggregationAPI,
    DatasetReadmeAPI,
)
from flask_restful import Api
import pickle

from services import ReadmeService


API_PREFIX: str = "/datasets"


def initialize(api: Api) -> None:
    fileService = FileService()
    datasetService = DatasetService(fileService=fileService)
    filename = "randomforest_model.sav"
    imputer_model = pickle.load(open(filename, "rb"))
    imputationService = ImputationService(
        fileService=fileService, imputer_model=imputer_model
    )
    readmeService = ReadmeService(
        datasetService=datasetService, fileService=fileService
    )

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
        DatasetPreviewAPI,
        f"{API_PREFIX}/<id>/preview",
        resource_class_kwargs={"datasetService": datasetService},
    )

    api.add_resource(
        PerformAggregationAPI,
        f"{API_PREFIX}/<id>/perform_aggregation",
        resource_class_kwargs={"datasetService": datasetService},
    )
    api.add_resource(
        DatasetColumnDescriptionAPI,
        f"{API_PREFIX}/<id>/col_description",
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
        resource_class_kwargs={"imputationService": imputationService},
    )
    api.add_resource(
        DatasetAutoImputation,
        f"{API_PREFIX}/<id>/auto_impute",
        resource_class_kwargs={"imputationService": imputationService},
    )

    api.add_resource(
        DatasetReadmeAPI,
        f"{API_PREFIX}/<id>/readme",
        resource_class_kwargs={"readmeService": readmeService},
    )

from http import HTTPStatus
from utils.enums import AggregationMethods
from utils.exceptions import DatasetNotFound
from flask import Response, jsonify
from mongoengine.errors import ValidationError
from services.DatasetService import DatasetService
from werkzeug.datastructures import FileStorage
from api.dataset.requestParsers import NewDatasetRequestParser, aggregationRequestParser
from flask_restful import Resource, marshal_with
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.dataset.responseTypes import getUserDatasetsAPIResponse, userDatasetDetails


class DataSetsAPI(Resource):
    method_decorators = [jwt_required()]

    def __init__(self, datasetService: DatasetService) -> None:
        super().__init__()
        self.datasetService = datasetService

    def post(self):
        body = NewDatasetRequestParser.parse_args()
        datasetFile: FileStorage = body["file"]
        self.datasetService.createDataset(datasetFile, datasetName=body["dataset_name"])
        return Response(status=HTTPStatus.CREATED)

    @marshal_with(getUserDatasetsAPIResponse)
    def get(self):
        user_id = get_jwt_identity()
        datasets = self.datasetService.get_datasets(user_id)
        return {"data": datasets}


class DatasetAPI(Resource):
    method_decorators = [jwt_required()]

    def __init__(self, datasetService: DatasetService) -> None:
        super().__init__()
        self.datasetService = datasetService

    @marshal_with(userDatasetDetails)
    def get(self, id):
        user_id = get_jwt_identity()
        try:
            dataset = self.datasetService.find_by_id(id, user_id)
            return dataset
        except ValidationError:
            raise DatasetNotFound

    def delete(self, id):
        user_id = get_jwt_identity()
        try:
            self.datasetService.delete_dataset(id, user_id)
            return Response(status=HTTPStatus.NO_CONTENT)
        except ValidationError:
            raise DatasetNotFound


class PerformAggregationAPI(Resource):
    method_decorators = [jwt_required()]

    def __init__(self, datasetService: DatasetService) -> None:
        super().__init__()
        self.datasetService = datasetService

    def post(self, id):
        body = aggregationRequestParser.parse_args()
        headers, values = self.datasetService.perform_aggregation(id, **body)
        return jsonify(
            {
                "data": {"headers": headers, "values": values},
            }
        )

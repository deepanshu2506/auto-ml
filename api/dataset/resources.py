from http import HTTPStatus
from flask import Response
from services.DatasetService import DatasetService
from services.FileService import FileService
from werkzeug.datastructures import FileStorage
from api.dataset.requestParsers import NewDatasetRequestParser
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
import pandas as pd


class DataSetsAPI(Resource):
    method_decorators = [jwt_required()]

    def __init__(self, datasetService: DatasetService) -> None:
        super().__init__()
        self.datasetService = datasetService

    def post(self):
        body = NewDatasetRequestParser.parse_args()
        datasetFile: FileStorage = body["file"]
        dataset = self.datasetService.createDataset(
            datasetFile, datasetName=body["dataset_name"]
        )

        return Response(status=HTTPStatus.CREATED)

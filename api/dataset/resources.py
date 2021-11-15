from http import HTTPStatus
from io import StringIO

from pandas.core.frame import DataFrame
from utils.exceptions import DatasetNotFound
from flask import Response, jsonify, make_response, send_file
from mongoengine.errors import ValidationError
from services.DatasetService import DatasetService
from api.dataset.requestParsers import (
    NewDatasetRequestParser,
    aggregationRequestParser,
    colDetailsRequestParser,
)
from flask_restful import Resource, marshal_with
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.dataset.responseTypes import getUserDatasetsAPIResponse, userDatasetDetails
import tempfile


class DataSetsAPI(Resource):
    method_decorators = [jwt_required()]

    def __init__(self, datasetService: DatasetService) -> None:
        super().__init__()
        self.datasetService = datasetService

    def post(self):
        body = NewDatasetRequestParser.parse_args()
        type = body["type"]
        if body.get("file") == None and type == "file":
            return make_response(
                jsonify(
                    {
                        "error": "dataset file or datasource from other integration is required"
                    }
                ),
                400,
            )

        datasetId = self.datasetService.createDataset(
            body["dataset_name"], body.get("file"), **body
        )
        print("DatasetId:", datasetId)
        return {"datasetId": str(datasetId)}, 201

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

class DatasetPreviewAPI(Resource):
    method_decorators = [jwt_required()]

    def __init__(self, datasetService: DatasetService) -> None:
        super().__init__()
        self.datasetService = datasetService

    def get(self, id):
        user_id = get_jwt_identity()
        try:
            df = self.datasetService.getDataset(id, user_id)
            df=df.head(20)
            columnNames=list(df.columns.values)      
            return Response(df.to_json(orient ='records'), mimetype='application/json')
        except ValidationError:
            raise DatasetNotFound

class PerformAggregationAPI(Resource):
    method_decorators = [jwt_required()]

    def __init__(self, datasetService: DatasetService) -> None:
        super().__init__()
        self.datasetService = datasetService

    def post(self, id):
        body = aggregationRequestParser.parse_args()
        headers, values, meta = self.datasetService.perform_aggregation(id, **body)
        if not body.get("export_to_file"):
            return jsonify(
                {
                    "data": {"headers": headers, "values": values, "meta": meta},
                }
            )
        else:
            result_df = DataFrame(values, columns=headers)
            csv_file = StringIO()
            filename = "%s.csv" % ('aggregation')
            result_df.to_csv(csv_file, encoding='utf-8',index=False)
            csv_output = csv_file.getvalue()
            csv_file.close()

            resp = make_response(csv_output)
            resp.headers["Content-Disposition"] = ("attachment; filename=%s" % filename)
            resp.headers["Content-Type"] = "text/csv"
            resp.headers['x-suggested-filename'] = filename
            return resp


class DatasetColDetailsAPI(Resource):
    method_decorators = [jwt_required()]

    def __init__(self, datasetService: DatasetService) -> None:
        super().__init__()
        self.datasetService = datasetService

    def get(self, id):
        user_id = get_jwt_identity()
        body = colDetailsRequestParser.parse_args()

        cols = self.datasetService.get_discrete_col_details(id, user_id, **body)
        return jsonify({"data": cols})

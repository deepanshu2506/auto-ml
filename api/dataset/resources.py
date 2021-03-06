from http import HTTPStatus
from io import StringIO
from typing import Dict, List

from pandas.core.frame import DataFrame
from utils.exceptions import DatasetNotFound
from flask import request, Response, jsonify, make_response
from mongoengine.errors import ValidationError
from services.DatasetService import DatasetService
from api.dataset.requestParsers import (
    NewDatasetRequestParser,
    aggregationRequestParser,
    colDetailsRequestParser,
    readmeInputRequestParser,
    colDescriptionRequestParser,
)
from flask_restful import Resource, marshal_with
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.dataset.responseTypes import getUserDatasetsAPIResponse, userDatasetDetails
from services import ReadmeService


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
        export_to_file = request.args.get("exportToFile", None)
        full_dataset_preview = request.args.get("fullDatasetPreview", None)

        try:
            df,datasetName = self.datasetService.getDataset(id, user_id)
            if full_dataset_preview == "true":
                return Response(
                    df.to_json(orient="records"), mimetype="application/json"
                )
            if export_to_file == "false":
                df = df.head(100)
            headers = list(df.columns.values)
            values = df.values.tolist()
            if export_to_file == "false":
                return {"dataset_name":datasetName,"headers": headers, "values": values}
            else:
                # result_df = DataFrame(values, columns=headers)
                csv_file = StringIO()
                filename = "%s.csv" % ("imputation")
                df.to_csv(csv_file, encoding="utf-8", index=False)
                csv_output = csv_file.getvalue()
                csv_file.close()

                resp = make_response(csv_output)
                resp.headers["Content-Disposition"] = (
                    "attachment; filename=%s" % filename
                )
                resp.headers["Content-Type"] = "text/csv"
                resp.headers["x-suggested-filename"] = filename
                return resp
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
            filename = "%s.csv" % ("aggregation")
            result_df.to_csv(csv_file, encoding="utf-8", index=False)
            csv_output = csv_file.getvalue()
            csv_file.close()

            resp = make_response(csv_output)
            resp.headers["Content-Disposition"] = "attachment; filename=%s" % filename
            resp.headers["Content-Type"] = "text/csv"
            resp.headers["x-suggested-filename"] = filename
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


class DatasetReadmeAPI(Resource):
    method_decorators = [jwt_required()]

    def __init__(self, readmeService: ReadmeService) -> None:
        super().__init__()
        self.readmeService = readmeService

    def get(self, id):
        user_id = get_jwt_identity()
        file_stream: StringIO = self.readmeService.get_readme_file(
            dataset_id=id, user_id=user_id
        )

        resp = make_response(file_stream.getvalue())
        resp.headers["Content-Type"] = "text/markdown"
        return resp

    def post(self, id):
        user_id = get_jwt_identity()
        body = readmeInputRequestParser.parse_args()
        self.readmeService.create_update_readme_file(id, user_id, **body)
        return {"status": "created"}, 201


class DatasetColumnDescriptionAPI(Resource):
    method_decorators = [jwt_required()]

    def __init__(self, datasetService: DatasetService) -> None:
        super().__init__()
        self.datasetService = datasetService

    def _get_descriptions(self, body: dict) -> List[Dict]:
        return body.get("data")

    def _update_descriptions(self, id):
        user_id = get_jwt_identity()
        body = colDescriptionRequestParser.parse_args()
        column_descriptions = self._get_descriptions(body)
        self.datasetService.set_col_description(id, user_id, column_descriptions)

    def post(self, id):
        self._update_descriptions(id)

    def put(self, id):
        self._update_descriptions(id)

    def patch(self, id):
        self._update_descriptions(id)

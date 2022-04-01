from typing import List
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import jsonify
from lib.deepeye_pack.chart import Chart
from services import VisualizationService
from api.visualization.requestParsers import autoVisualizationRequestParser


class CorrelationAPI(Resource):
    method_decorators = [jwt_required()]

    def __init__(self, visualizationService: VisualizationService) -> None:
        super().__init__()
        self.visualizationService = visualizationService

    def get(self, dataset_id):
        print("Correlation")
        user_id = get_jwt_identity()
        labels, arr = self.visualizationService.get_correlation(dataset_id, user_id)
        return jsonify({"labels": labels, "arr": arr})


class AutoVisualizationAPI(Resource):
    def __init__(self, visualizationService: VisualizationService) -> None:
        super().__init__()
        self.visualizationService = visualizationService

    method_decorators = [jwt_required()]

    def post(self, dataset_id):
        user_id = get_jwt_identity()
        body = autoVisualizationRequestParser.parse_args()
        body["dropped_columns"] = (
            body.get("dropped_columns")
            if body.get("dropped_columns") is not None
            else []
        )
        visualizations: List[Chart] = self.visualizationService.get_visualizations(
            dataset_id, user_id, **body
        )
        print(len(visualizations))
        return jsonify(list(map(lambda x: x.to_dict(), visualizations)))

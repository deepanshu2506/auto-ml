from typing import List
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import jsonify
from lib.deepeye_pack.chart import Chart
from services import VisualizationService
from api.visualization.requestParsers import autoVisualizationRequestParser


class AutoVisualizationAPI(Resource):
    def __init__(self, visualizationService: VisualizationService) -> None:
        super().__init__()
        self.visualizationService = visualizationService

    method_decorators = [jwt_required()]

    def post(self, dataset_id):
        user_id = get_jwt_identity()
        body = autoVisualizationRequestParser.parse_args()
        visualizations: List[Chart] = self.visualizationService.get_visualizations(
            dataset_id, user_id, **body
        )
        print(len(visualizations))
        return jsonify(list(map(lambda x: x.to_dict(), visualizations)))

from typing import List
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import jsonify
from lib.deepeye_pack.chart import Chart
from services import VisualizationService
from api.visualization.requestParsers import autoVisualizationRequestParser, manualVisualizationRequestParser


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


class ManualVisualizationAPI(Resource):
    def __init__(self, visualizationService: VisualizationService) -> None:
        super().__init__()
        self.visualizationService = visualizationService

    method_decorators = [jwt_required()]

    def post(self, dataset_id):
        user_id = get_jwt_identity()
        body = manualVisualizationRequestParser.parse_args()
        headers, values, meta =  self.visualizationService.get_manual_visualization(
            dataset_id, user_id, **body
        )
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

   
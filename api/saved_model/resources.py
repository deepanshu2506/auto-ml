from flask_restful import Resource
from services import SavedModelService
from flask_jwt_extended import jwt_required,get_jwt_identity
from flask import jsonify
from api.saved_model.requestParsers import InferenceParser
class InferenceAPI(Resource):
    def __init__(self, savedModelService: SavedModelService) -> None:
        super().__init__()
        self.savedModelService = savedModelService

    method_decorators = [jwt_required()]

    def post(self, saved_model_id):
        user_id = get_jwt_identity()
        body = InferenceParser.parse_args()
        inference = self.savedModelService.perform_inference(
            saved_model_id, user_id, **body
        )
        return jsonify({"inference": inference})

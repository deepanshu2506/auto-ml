from flask_restful import Resource, marshal_with, marshal_with_field
from services import SavedModelService
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import jsonify
from api.saved_model.requestParsers import InferenceParser
from flask_restful import fields
from db.models.SavedModels import SavedModel


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


class GetSavedModelsAPI(Resource):
    def __init__(self, savedModelService: SavedModelService) -> None:
        super().__init__()
        self.savedModelService = savedModelService

    method_decorators = [jwt_required()]

    @marshal_with_field(
        fields.List(fields.Nested(SavedModel.to_output(detailed=False)))
    )
    def get(self):
        user_id = get_jwt_identity()
        models = self.savedModelService.get_models_by_user(user_id=user_id)
        return models

from http import HTTPStatus
from flask_jwt_extended.utils import get_jwt_identity
from flask_restful import Resource
from flask import Response
from flask_jwt_extended import jwt_required
from services.ModelGeneratorService import ModelGeneratorService
from api.ModelSelection.requestParsers import modelSelectionRequestParser


class ModelSelectionResource(Resource):
    def __init__(self, modelGenerationService: ModelGeneratorService) -> None:
        super().__init__()
        self.modelGenerationService = modelGenerationService

    method_decorators = [jwt_required()]

    def post(self):
        body = modelSelectionRequestParser.parse_args()
        user_id = get_jwt_identity()
        self.modelGenerationService.generateModels(
            user_id=user_id,
            dataset_id=body["dataset_id"],
            target_col=body["target_col"],
        )
        return Response(status=HTTPStatus.ACCEPTED)

from http import HTTPStatus
from flask_jwt_extended.utils import get_jwt_identity
from flask_restful import Resource, marshal_with
from flask import Response, jsonify
from flask_jwt_extended import jwt_required
from werkzeug.wrappers import response
from db.models.ModelSelectionJobs import ModelSelectionJob
from services.ModelGeneratorService import ModelGeneratorService
from api.ModelSelection.requestParsers import modelSelectionRequestParser
from services.ModelSelectionJobService import ModelSelectionJobService


class ModelSelectionResource(Resource):
    def __init__(self, modelGenerationService: ModelGeneratorService) -> None:
        super().__init__()
        self.modelGenerationService = modelGenerationService

    method_decorators = [jwt_required()]

    def post(self):
        body = modelSelectionRequestParser.parse_args()
        user_id = get_jwt_identity()
        job = self.modelGenerationService.generateModels(
            user_id=user_id,
            dataset_id=body["dataset_id"],
            target_col=body["target_col"],
        )
        response = {"job_id": str(job.id)}
        return response, HTTPStatus.CREATED


class ModelSelectionJobResource(Resource):
    def __init__(
        self,
        modelGenerationService: ModelGeneratorService,
        modelSelectionJobService: ModelSelectionJobService,
    ) -> None:
        super().__init__()
        self.modelGenerationService = modelGenerationService
        self.modelSelectionJobService = modelSelectionJobService

    method_decorators = [jwt_required()]

    def get(self, model_selection_job_id):
        user_id = get_jwt_identity()
        model_selection_job = self.modelSelectionJobService.find_by_id(
            model_selection_job_id, user_id=user_id
        )
        return model_selection_job.to_json()


class ExportGeneratedModelResource(Resource):
    def __init__(
        self,
        modelGenerationService: ModelGeneratorService,
        modelSelectionJobService: ModelSelectionJobService,
    ) -> None:
        super().__init__()
        self.modelGenerationService = modelGenerationService
        self.modelSelectionJobService = modelSelectionJobService

    method_decorators = [jwt_required()]

    def post(self, model_selection_job_id, model_id):
        user_id = get_jwt_identity()
        job = self.modelSelectionJobService.find_by_id(model_selection_job_id, user_id)
        self.modelGenerationService.exportModel(job, model_id)
        pass

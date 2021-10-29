from http import HTTPStatus
from flask_jwt_extended.utils import get_jwt_identity
from flask_restful import Resource, marshal_with
from flask_jwt_extended import jwt_required
from db.models.SavedModels import SavedModel
from flask import jsonify, send_file
from services.ModelGeneratorService import ModelGeneratorService
from api.ModelSelection.requestParsers import (
    InferenceParser,
    modelSelectionRequestParser,
    exportModelParser,
    exportSavedModelParser,
)
from services.ModelSelectionJobService import ModelSelectionJobService
from services.SavedModelService import SavedModelService


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

    @jwt_required()
    @marshal_with(SavedModel.to_output())
    def post(self, model_selection_job_id, model_id):
        user_id = get_jwt_identity()
        body = exportModelParser.parse_args()
        job = self.modelSelectionJobService.find_by_id(model_selection_job_id, user_id)
        savedModel: SavedModel = self.modelGenerationService.exportModel(
            job,
            model_id,
            **body,
        )
        return savedModel


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


class ExportSavedModelAPI(Resource):
    def __init__(self, savedModelService: SavedModelService) -> None:
        super().__init__()
        self.savedModelService = savedModelService

    method_decorators = [jwt_required()]

    def get(self, saved_model_id):
        user_id = get_jwt_identity()
        body = exportSavedModelParser.parse_args()
        exported_model = self.savedModelService.export_saved_model(
            saved_model_id, user_id, **body
        )
        return send_file(exported_model, mimetype="application/x-tar")

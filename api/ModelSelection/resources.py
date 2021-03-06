from http import HTTPStatus
from flask_jwt_extended.utils import get_jwt_identity
from flask_restful import Resource, marshal_with, marshal_with_field, fields
from flask_jwt_extended import jwt_required
from db.models.SavedModels import SavedModel
from db.models.ModelSelectionJobs import ModelSelectionJob
from flask import jsonify

# from db.models.SavedModels import SavedModel,ModelSelectionJob
from flask import jsonify, Response
from services.ModelGeneratorService import ModelGeneratorService
from api.ModelSelection.requestParsers import (
    modelSelectionRequestParser,
    exportModelParser,
)
from services.ModelSelectionJobService import ModelSelectionJobService
from services.SavedModelService import SavedModelService


class ModelSelectionResource(Resource):
    def __init__(self, modelGenerationService: ModelGeneratorService) -> None:
        super().__init__()
        self.modelGenerationService = modelGenerationService

    method_decorators = [jwt_required()]

    def post(self, id):
        body = modelSelectionRequestParser.parse_args()
        user_id = get_jwt_identity()
        job = self.modelGenerationService.generateModels(
            user_id=user_id,
            dataset_id=id,
            target_col=body["target_col"],
        )
        response = {"job_id": str(job.id)}
        return response, HTTPStatus.CREATED


class ModelSelectionJobListResource(Resource):
    def __init__(self, modelGenerationService: ModelGeneratorService) -> None:
        super().__init__()
        self.modelGenerationService = modelGenerationService

    method_decorators = [jwt_required()]

    @marshal_with_field(
        fields.List(fields.Nested(ModelSelectionJob.to_output(detailed=False)))
    )
    def get(self):
        user_id = get_jwt_identity()
        jobs_list = self.modelGenerationService.list_models(
            user_id=user_id,
        )
        for job in jobs_list:
            job: ModelSelectionJob = job
            print(job.to_json())
        return jobs_list


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

    @marshal_with(ModelSelectionJob.to_output(detailed=True))
    def get(self, model_selection_job_id):
        user_id = get_jwt_identity()
        model_selection_job = self.modelSelectionJobService.find_by_id(
            model_selection_job_id, user_id=user_id
        )
        return model_selection_job


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
            user_id,
            **body,
        )
        return savedModel

from services.DatasetService import DatasetService
from flask_jwt_extended.utils import get_jwt_identity
from flask_jwt_extended.view_decorators import jwt_required
from flask_restful import Resource
from api.dataset.requestParsers import singleColImputationRequestParser


class DatasetSingleColImputation(Resource):
    method_decorators = [jwt_required()]

    def __init__(self, datasetService: DatasetService) -> None:
        super().__init__()
        self.datasetService = datasetService

    def post(self, id):
        user_id = get_jwt_identity()
        args = singleColImputationRequestParser.parse_args()
        self.datasetService.impute_col(id, **args)

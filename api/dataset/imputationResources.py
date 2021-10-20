from services.ImputationService import ImputationService
from flask_jwt_extended.utils import get_jwt_identity
from flask_jwt_extended.view_decorators import jwt_required
from flask_restful import Resource
from api.dataset.requestParsers import singleColImputationRequestParser,autoImputationRequestParser


class DatasetSingleColImputation(Resource):
    method_decorators = [jwt_required()]

    def __init__(self, imputationService: ImputationService) -> None:
        super().__init__()
        self.imputationService = imputationService

    def post(self, id):
        user_id = get_jwt_identity()
        args = singleColImputationRequestParser.parse_args()
        imputation_result_stats = self.imputationService.impute_col(id, **args)
        return {"data": imputation_result_stats}


class DatasetAutoImputation(Resource):
    method_decorators = [jwt_required()]

    def __init__(self, imputationService: ImputationService) -> None:
        super().__init__()
        self.imputationService = imputationService

    def post(self, id):
        user_id = get_jwt_identity()
        args = autoImputationRequestParser.parse_args()
        imputation_res=self.imputationService.impute_dataset(id, **args)
        return {"Imputer selected":imputation_res[0],"data": imputation_res[1]}
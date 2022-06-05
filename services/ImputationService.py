from datetime import datetime
from typing import List
from lib.Preprocessor import DataFrameOrdinalencoder, OrdinalEncoderProps
from services.OperationService import OperationsService
from utils.enums import (
    Coltype,
    DatasetStates,
    ImputationMethods,
    JobTypes,
)
from utils.pdUtils import is_discrete_auto_impute
from flask_jwt_extended.utils import get_jwt_identity
from services.FileService import FileService
from pandas import DataFrame
from services.DatasetService import DatasetService
from lib.auto_imputer import AutoImputerFactory


from db.models.Dataset import Dataset, DatasetFeature, DatasetJob, JobStats


class ImputationService:
    def __init__(
        self,
        fileService: FileService,
        operationService: OperationsService,
        datasetService: DatasetService,
        imputer_model,
    ) -> None:
        self.fileService = fileService
        self.operationService = operationService
        self.datasetService = datasetService
        self.imputer_model = imputer_model

    def _get_dataset(self, dataset_id):
        return self.datasetService.find_by_id(dataset_id, get_jwt_identity())

    def impute_col(
        self, dataset_id, col_name, impute_type: ImputationMethods, value=None
    ):
        dataset = self._get_dataset(dataset_id=dataset_id)

        output = self.operationService.perform_operation(
            dataset=dataset,
            jobType=JobTypes.SINGLE_COL_IMPUTATION,
            inputs={"impute_type": impute_type, "col_name": col_name, "value": value},
        )
        return output

    def impute_dataset(self, dataset_id, target_col_name):
        dataset = self._get_dataset(dataset_id=dataset_id)

        output = self.operationService.perform_operation(
            dataset=dataset,
            jobType=JobTypes.MULTI_COL_IMPUTATION,
            inputs={"target_col_name": target_col_name},
        )
        return output

from typing import Dict
from tensorflow.keras.models import Model
from db.models.SavedModels import ModelFeatures, SavedModel
from lib.model_selection.ann_encoding import ProblemType
from utils.enums import Coltype, DataTypes
from utils.exceptions import InvalidInputFormatForModelError, ModelNotFound
from services.FileService import FileService
from tensorflow import convert_to_tensor

from utils.numbers import isfloat


class SavedModelService:
    def __init__(self, fileService: FileService) -> None:
        self.fileService = fileService
        pass

    def findById(self, id, user_id) -> SavedModel:
        models = SavedModel.objects(id=id, created_by=user_id)
        if len(models) == 0:
            raise ModelNotFound
        return models[0]

    def get_models_by_user(self, user_id):
        models = SavedModel.objects(created_by=user_id)
        return models

    def _load_model(self, model: SavedModel) -> Model:
        tf_model = self.fileService.get_model(model.model_location)
        return tf_model

    def _check_single_input_validity(
        self, input_dict: Dict, feature: ModelFeatures
    ) -> bool:
        value = input_dict.get(feature.name)
        if value is None:
            return False

        str_value = str(value)

        if feature.dataType == DataTypes.NUMBER:
            is_valid_numeric = isfloat(str_value) or str_value.isnumeric()
            if is_valid_numeric is False:
                return False
        if feature.type == Coltype.DISCRETE and str_value not in feature.allowed_Values:
            return False
        return True

    def sanitize_single_input(self, value, feature: ModelFeatures):
        sanitized_value = str(value)
        if feature.dataType == DataTypes.NUMBER:
            if sanitized_value.isnumeric():
                sanitized_value = int(sanitized_value)
            elif isfloat(sanitized_value):
                sanitized_value = float(sanitized_value)

        return sanitized_value

    def _verify_sanitize_inputs(self, model: SavedModel, input_dict: Dict) -> bool:
        required_inputs = list(
            filter(lambda x: x.name != model.target_col, model.features)
        )
        sanitized_inputs = {}
        for feature in required_inputs:

            feature: ModelFeatures = feature
            is_valid = self._check_single_input_validity(input_dict, feature)
            if is_valid:
                value = input_dict.get(feature.name)
                sanitized_value = self.sanitize_single_input(value, feature)
                sanitized_inputs[feature.name] = sanitized_value
            else:
                raise InvalidInputFormatForModelError

        return sanitized_inputs

    def _convert_to_tensor(self, input_dict):
        tensor = {
            name: convert_to_tensor([value]) for name, value in input_dict.items()
        }
        return tensor

    def perform_inference(self, model_id, user_id, input, **kwargs):
        model_meta = self.findById(model_id, user_id)
        model = self._load_model(model_meta)
        sanitized_inputs = self._verify_sanitize_inputs(model_meta, input)
        tensor = self._convert_to_tensor(sanitized_inputs)
        results = model.predict(tensor)
        predictions = results
        if model_meta.ProblemType == ProblemType.Classification:
            predictions = [
                dict(zip(model_meta.classes, [round(float(x), 3) for x in result]))
                for result in predictions
            ]
        else:
            predictions = results.tolist()
        return predictions

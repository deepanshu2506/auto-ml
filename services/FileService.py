import os
from pandas.core.frame import DataFrame
from tensorflow.keras.models import Model, load_model
from werkzeug.datastructures import FileStorage
from config import Config
import pandas as pd


class FileService:
    def __init__(self) -> None:
        pass

    def convert_to_dataset(self, file: FileStorage):
        return pd.read_csv(file)

    def save_dataset(
        self,
        dataset: DataFrame,
        user_id: str = None,
        dataset_id: str = None,
        dataset_path=None,
    ) -> str:
        file_path = dataset_path or (
            os.path.join(Config.UPLOAD_DIRECTORY, f"{user_id}_{dataset_id}.csv")
        )
        dataset.to_csv(file_path, index=False)
        return file_path, os.stat(file_path).st_size

    def get_dataset_from_url(self, url) -> DataFrame:
        return pd.read_csv(url)

    def save_model(self, model: Model, job_id, model_id) -> str:
        file_path = os.path.join(Config.MODEL_SAVE_DIRECTORY, f"{job_id}_{model_id}")
        model.save(file_path, overwrite=True, include_optimizer=True)
        return file_path

    def get_model(modelPath) -> Model:
        return load_model(modelPath)


class MockFileService(FileService):
    path = "C:\\Users\\deepa\\Desktop\\winequalityN.csv"

    def convert_to_dataset(self, file: FileStorage):
        return pd.read_csv(MockFileService.path)

    def save_dataset(self, dataset: DataFrame, user_id: str, dataset_id: str) -> str:
        return MockFileService.path, 3000

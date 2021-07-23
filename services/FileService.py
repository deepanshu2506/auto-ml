import os
from pandas.core.frame import DataFrame
from werkzeug.datastructures import FileStorage
from config import Config
import pandas as pd


class FileService:
    def __init__(self) -> None:
        pass

    def convert_to_dataset(self, file: FileStorage):
        return pd.read_csv(file)

    def save_dataset(self, dataset: DataFrame, user_id: str, dataset_id: str) -> str:
        file_path = os.path.join(Config.UPLOAD_DIRECTORY, f"{user_id}_{dataset_id}.csv")
        dataset.to_csv(file_path)
        return file_path, os.stat(file_path).st_size

    def get_dataset_from_url(self, url) -> DataFrame:
        return pd.read_csv(url)


class MockFileService(FileService):
    path = "C:\\Users\\deepa\\Desktop\\winequalityN.csv"

    def convert_to_dataset(self, file: FileStorage):
        return pd.read_csv(MockFileService.path)

    def save_dataset(self, dataset: DataFrame, user_id: str, dataset_id: str) -> str:
        return MockFileService.path, 3000

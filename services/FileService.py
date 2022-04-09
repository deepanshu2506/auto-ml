from io import StringIO, BytesIO
from msilib.schema import File
import os
import tempfile
import zipfile
from pandas.core.frame import DataFrame
from tensorflow.keras.models import Model, load_model
from werkzeug.datastructures import FileStorage
from config import Config
import pandas as pd


class FileService:
    def __init__(self) -> None:
        pass

    def _get_all_file_paths(self, directory):
        file_paths = []

        for root, directories, files in os.walk(directory):
            for filename in files:
                filepath = os.path.join(root, filename)
                file_paths.append(filepath)

        return file_paths

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
        model.save(file_path, overwrite=True)
        return file_path

    def get_model(self, modelPath) -> Model:
        return load_model(modelPath)

    def get_model_zipped(self, modelPath) -> BytesIO:
        print(modelPath)
        file_paths = self._get_all_file_paths(modelPath)
        io = BytesIO()
        with zipfile.ZipFile(io, "w") as zip:
            # writing each file one by one
            for file in file_paths:
                zip.write(file)

        return io

    def save_readme_file(self, content, dataset_id, path=None):
        file_path = os.path.join(Config.README_SAVE_DIRECTORY, f"{dataset_id}.md")
        f = open(path or file_path, mode="w")
        f.write(content)
        f.close()
        return file_path

    def get_readme_file(self, path) -> StringIO:
        f = open(path)
        stream = StringIO(f.read())
        return stream


class MockFileService(FileService):
    path = "C:\\Users\\deepa\\Desktop\\winequalityN.csv"

    def convert_to_dataset(self, file: FileStorage):
        return pd.read_csv(MockFileService.path)

    def save_dataset(self, dataset: DataFrame, user_id: str, dataset_id: str) -> str:
        return MockFileService.path, 3000

from io import StringIO
from services.DatasetService import DatasetService
from services.FileService import FileService
from utils.exceptions import DatasetNotFound


class ReadmeService:
    def __init__(
        self, datasetService: DatasetService, fileService: FileService
    ) -> None:
        self.datasetService = datasetService
        self.fileService = fileService

    def create_update_readme_file(self, dataset_id, user_id, contents):
        readme_path = self.datasetService.get_readme(dataset_id, user_id)
        already_exists = readme_path is not None
        readme_path = self.fileService.save_readme_file(
            content=contents, dataset_id=dataset_id, path=readme_path
        )
        try:
            if not already_exists:
                self.datasetService.set_readme(dataset_id, user_id, readme_path)
        except DatasetNotFound as e:
            self.fileService.delete_file(readme_path)
            raise e

    def get_readme_file(self, dataset_id, user_id)->StringIO:
        readme_path = self.datasetService.get_readme(dataset_id, user_id)
        readme_file = self.fileService.get_readme_file(readme_path)
        return readme_file

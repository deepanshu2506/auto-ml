from typing import List
from lib.deepeye_pack import deepeye
from lib.deepeye_pack.chart import Chart

from services import FileService, DatasetService


class VisualizationService:
    def __init__(
        self, fileService: FileService, datasetService: DatasetService
    ) -> None:
        self.fileService = fileService
        self.datasetService = datasetService
        pass

    def get_visualizations(
        self, dataset_id: str, user_id: str, count: int = 10
    ) -> List[Chart]:
        dataset = self.datasetService.find_by_id(dataset_id, user_id)
        dp = deepeye(dataset.name)
        dp.from_csv(dataset.datasetLocation)
        dp.learning_to_rank()
        visualizations: List[Chart] = dp.to_list()[:count]
        return visualizations

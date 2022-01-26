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
        self, dataset_id: str, user_id: str, count: int = None
    ) -> List[Chart]:
        dataset = self.datasetService.find_by_id(dataset_id, user_id)
        dp = deepeye(dataset.name)
        dp.from_csv(dataset.datasetLocation)
        dp.partial_order()
        visualizations: List[Chart] = dp.to_list()[:count]
        return visualizations

    def get_visualizations_by_cols(
        self, dataset_id: str, user_id: str, x_col: str, y_col: str, count: int = None
    ) -> List[Chart]:
        visualizations = self.get_visualizations(dataset_id, user_id)
        visualizations_by_col = list(
            filter(self.get_visualizations_by_cols(x_col, y_col), visualizations)
        )
        return visualizations_by_col[:count]

    def get_filter_by_col_method(x_col: str, y_col: str):
        def filter_method(chart: Chart):
            return chart.x_name == x_col and chart.y_name == y_col
        return filter_method

from typing import List
from matplotlib.pyplot import axis

from pandas import DataFrame
from db.models.Dataset import Dataset
from lib.deepeye_pack import deepeye
from lib.deepeye_pack.chart import Chart
from utils.pdUtils import (
    build_query,
    get_col_type,
    get_datatype,
    perform_aggregation,
    getCorrelation,
)
from services import FileService, DatasetService
from utils.enums import AggregationMethods


class VisualizationService:
    def __init__(
        self, fileService: FileService, datasetService: DatasetService
    ) -> None:
        self.fileService = fileService
        self.datasetService = datasetService
        pass

    def get_visualizations(
        self,
        dataset_id: str,
        user_id: str,
        count: int = None,
        dropped_columns: List[str] = [],
    ) -> List[Chart]:
        dataset = self.datasetService.find_by_id(dataset_id, user_id)
        raw_dataset = self.fileService.get_dataset_from_url(dataset.datasetLocation)
        name = dataset.datasetLocation.rsplit("/", 1)[-1].rsplit("\\", 1)[-1][:-4]
        dp = deepeye(dataset.name)

        modified_dataset = self._preprocess(raw_dataset, dropped_columns)

        dp.from_dataframe(modified_dataset, name)
        dp.partial_order()
        # visualizations: List[Chart] = dp.to_list()[:count]
        visualizations: List[Chart] = dp.to_list()
        if len(visualizations) > 50:
            visualizations = visualizations[:50]
        return visualizations

    def _preprocess(self, df: DataFrame, dropped_columns: List[str] = []):
        if len(dropped_columns) > 0:
            return df.drop(dropped_columns, axis=1)
        else:
            return df

    def get_correlation(self, dataset_id: str, user_id: str):
        dataset: Dataset = self.datasetService.find_by_id(dataset_id, user_id)
        dataset_frame: DataFrame = self.fileService.get_dataset_from_url(
            dataset.datasetLocation
        )
        corrMat = getCorrelation(dataset_frame)
        print(corrMat)
        labels = list(corrMat)
        arr = corrMat.values.tolist()
        return labels, arr

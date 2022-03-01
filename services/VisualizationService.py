from typing import List
from lib.deepeye_pack import deepeye
from lib.deepeye_pack.chart import Chart
from utils.pdUtils import build_query, get_col_type, get_datatype, perform_aggregation,getCorrelation
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
        self, dataset_id: str, user_id: str, count: int = None
    ) -> List[Chart]:
        dataset = self.datasetService.find_by_id(dataset_id, user_id)
        dp = deepeye(dataset.name)
        dp.from_csv(dataset.datasetLocation)
        dp.partial_order()
        #visualizations: List[Chart] = dp.to_list()[:count]
        visualizations: List[Chart] = dp.to_list()
        return visualizations

    def get_correlation(
        self,
         dataset_id: str,
        user_id: str
    ):
        dataset: Dataset = self.datasetService.find_by_id(dataset_id, user_id)
        dataset_frame: DataFrame = self.fileService.get_dataset_from_url(
            dataset.datasetLocation
        )
        corrMat=getCorrelation(dataset_frame)
        print(corrMat)
        labels=list(corrMat)
        arr=corrMat.values.tolist()
        return labels,arr


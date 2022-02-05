from typing import List
from lib.deepeye_pack import deepeye
from lib.deepeye_pack.chart import Chart
from utils.pdUtils import build_query, get_col_type, get_datatype, perform_aggregation
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
        # dp.partial_order()
        dp.learning_to_rank()
        visualizations: List[Chart] = dp.to_list()[:count]
        return visualizations

    def get_manual_visualization(
        self,
        dataset_id: str,
        user_id: str,
        field1:None,
        field2:None,
        chart_type:str,
        aggregate_method: AggregationMethods = None,
        groupby_field: str = None,
        aggregate_by_field: str = None,
        filter: list = None,
        max_records=100,
        export_to_file=False):
        
        dataset: Dataset = self.datasetService.find_by_id(dataset_id, user_id)
        dataset_frame: DataFrame = self.fileService.get_dataset_from_url(
            dataset.datasetLocation
        )
        # columns=[]
        # if field1: 
        #     columns.append(field1)
        # if field2:
        #     columns.append(field2)
        # if columns:
        #     df = df.iloc[:, columns]
        if filter:
            print(filter)
            filter_query = build_query(filter)
            print(filter_query)
            dataset_frame: DataFrame = dataset_frame.query(filter_query)
        aggregated_df = dataset_frame
        is_aggregate = groupby_field and aggregate_method and aggregate_by_field
        if is_aggregate:
            aggregated_df = perform_aggregation(
                dataset_frame.groupby(groupby_field)[aggregate_by_field],
                aggregate_func=aggregate_method,
            )
        aggregation_result = (
            list(aggregated_df.fillna("NA").iteritems())
            if is_aggregate
            else dataset_frame.fillna("NA").values.tolist()
        )
        meta = {"total_records": len(aggregation_result)}
        if not export_to_file:
            aggregation_result = aggregation_result[:max_records]
        meta["returned_records"] = len(aggregation_result)
        headers = (
            (
                groupby_field,
                f"{aggregate_by_field.replace(' ' , '_')}_{aggregate_method.value}",
            )
            if is_aggregate
            else dataset_frame.columns.tolist()
        )

        return headers, aggregation_result, meta

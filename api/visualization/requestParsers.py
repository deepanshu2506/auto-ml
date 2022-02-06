from flask_restful import reqparse
from utils.validators import enum_validator
from utils.enums import AggregationMethods
autoVisualizationRequestParser = reqparse.RequestParser()
autoVisualizationRequestParser.add_argument(
    "count", type=int, required=False, default=10
)


manualVisualizationRequestParser = reqparse.RequestParser()
# manualVisualizationRequestParser.add_argument(
#     "count", type=int, required=False, default=10
# )
manualVisualizationRequestParser.add_argument(
    "aggregate_method", type=enum_validator(AggregationMethods)
)
manualVisualizationRequestParser.add_argument("field1", type=str)
manualVisualizationRequestParser.add_argument("field2", type=str)
manualVisualizationRequestParser.add_argument("chart_type", type=str,required=True)
manualVisualizationRequestParser.add_argument("groupby_field", type=str)
manualVisualizationRequestParser.add_argument("aggregate_by_field", type=str)
manualVisualizationRequestParser.add_argument("filter", type=dict, action="append")
manualVisualizationRequestParser.add_argument("export_to_file", type=bool)


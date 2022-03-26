from flask_restful import reqparse
from utils.validators import enum_validator
from utils.enums import AggregationMethods

autoVisualizationRequestParser = reqparse.RequestParser()
autoVisualizationRequestParser.add_argument(
    "count", type=int, required=False, default=10
)
autoVisualizationRequestParser.add_argument(
    "dropped_columns", type=str, action="append", location="json"
)

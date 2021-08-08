from utils.enums import AggregationMethods
from utils.validators import enum_validator
from flask_restful import reqparse
from werkzeug.datastructures import FileStorage

NewDatasetRequestParser = reqparse.RequestParser()
NewDatasetRequestParser.add_argument(
    "file", type=FileStorage, location="files", required=True
)
NewDatasetRequestParser.add_argument("dataset_name", type=str, required=True)


aggregationRequestParser = reqparse.RequestParser()
aggregationRequestParser.add_argument(
    "aggregate_method", type=enum_validator(AggregationMethods), required=True
)
aggregationRequestParser.add_argument("groupby_field", type=str, required=True)
aggregationRequestParser.add_argument("aggregate_by_field", type=str, required=True)

aggregationRequestParser.add_argument("filter", type=dict)


colDetailsRequestParser = reqparse.RequestParser()
colDetailsRequestParser.add_argument(
    "num_samples", type=enum_validator(AggregationMethods), default=10
)

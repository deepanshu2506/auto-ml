from utils.enums import AggregationMethods, ImputationMethods
from utils.validators import enum_validator
from flask_restful import reqparse
from werkzeug.datastructures import FileStorage

NewDatasetRequestParser = reqparse.RequestParser()
NewDatasetRequestParser.add_argument("file", type=FileStorage, location="files")
NewDatasetRequestParser.add_argument("dataset_name", type=str, required=True)
NewDatasetRequestParser.add_argument("type", type=str, default="file")
NewDatasetRequestParser.add_argument("host", type=str, default="file")
NewDatasetRequestParser.add_argument("port", type=str, default="file")
NewDatasetRequestParser.add_argument("user", type=str, default="file")
NewDatasetRequestParser.add_argument("password", type=str, default="file")
NewDatasetRequestParser.add_argument("database", type=str, default="file")
NewDatasetRequestParser.add_argument("query", type=str, default="file")
NewDatasetRequestParser.add_argument("null_placeholder")

aggregationRequestParser = reqparse.RequestParser()
aggregationRequestParser.add_argument(
    "aggregate_method", type=enum_validator(AggregationMethods), required=True
)
aggregationRequestParser.add_argument("groupby_field", type=str, required=True)
aggregationRequestParser.add_argument("aggregate_by_field", type=str, required=True)

aggregationRequestParser.add_argument("filter", type=dict)


colDetailsRequestParser = reqparse.RequestParser()
colDetailsRequestParser.add_argument("num_samples", type=int, default=10)


singleColImputationRequestParser = reqparse.RequestParser()
singleColImputationRequestParser.add_argument("col_name", type=str, required=True)
singleColImputationRequestParser.add_argument(
    "impute_type", type=enum_validator(ImputationMethods), required=True
)
singleColImputationRequestParser.add_argument("value", type=str)

autoImputationRequestParser = reqparse.RequestParser()
autoImputationRequestParser.add_argument("target_col_name", type=str, required=True)

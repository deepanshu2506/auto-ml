from flask_restful import reqparse
from werkzeug.datastructures import FileStorage

NewDatasetRequestParser = reqparse.RequestParser()
NewDatasetRequestParser.add_argument(
    "file", type=FileStorage, location="files", required=True
)
NewDatasetRequestParser.add_argument("dataset_name", type=str, required=True)

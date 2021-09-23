from flask_restful import reqparse


modelSelectionRequestParser = reqparse.RequestParser()
modelSelectionRequestParser.add_argument("dataset_id", type=str, required=True)
modelSelectionRequestParser.add_argument("target_col", type=str, required=True)

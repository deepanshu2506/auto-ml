from math import e
from flask_restful import reqparse


modelSelectionRequestParser = reqparse.RequestParser()
modelSelectionRequestParser.add_argument("dataset_id", type=str, required=True)
modelSelectionRequestParser.add_argument("target_col", type=str, required=True)

exportModelParser = reqparse.RequestParser()
exportModelParser.add_argument("epochs", type=int)
exportModelParser.add_argument("model_name", type=str)


InferenceParser = reqparse.RequestParser()
InferenceParser.add_argument("input", type=dict, required=True)

exportSavedModelParser = reqparse.RequestParser()
exportSavedModelParser.add_argument("model_name", type=str)

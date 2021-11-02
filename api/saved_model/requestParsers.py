from flask_restful import reqparse
InferenceParser = reqparse.RequestParser()
InferenceParser.add_argument("input", type=dict, required=True)

from flask_restful import reqparse

autoVisualizationRequestParser = reqparse.RequestParser()
autoVisualizationRequestParser.add_argument("count",type=int,required=False)

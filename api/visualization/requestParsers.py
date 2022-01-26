from flask_restful import reqparse

autoVisualizationRequestParser = reqparse.RequestParser()
autoVisualizationRequestParser.add_argument(
    "count", type=int, required=False, default=10
)

visualizationByColRequestParser = autoVisualizationRequestParser.copy()
visualizationByColRequestParser.add_argument("x_col",type='string',required=True)
visualizationByColRequestParser.add_argument("y_col",type='string',required=True)
from flask_restful import reqparse

DbConnCheckerParser = reqparse.RequestParser()
DbConnCheckerParser.add_argument("type", type=str, required=True)
DbConnCheckerParser.add_argument(
    "host", 
    type=str,required=True
)
DbConnCheckerParser.add_argument(
    "port",
    type=str,required=True
)
DbConnCheckerParser.add_argument(
    "user",
    type=str,required=True
)
DbConnCheckerParser.add_argument(
    "password",
    type=str,required=True
)
DbConnCheckerParser.add_argument(
    "database",
    type=str,required=True
)

from flask_restful import reqparse


DbConnCheckerParser = reqparse.RequestParser()
DbConnCheckerParser.add_argument("type", type=str, required=True)
DbConnCheckerParser.add_argument("host", type=str, required=True)
DbConnCheckerParser.add_argument("port", type=str, required=True)
DbConnCheckerParser.add_argument("user", type=str, required=True)
DbConnCheckerParser.add_argument("password", type=str, required=True)
DbConnCheckerParser.add_argument("database", type=str, required=True)

DbDataPreviewParser = DbConnCheckerParser.copy()
DbDataPreviewParser.add_argument("query", type=str, required=True)
DbDataPreviewParser.add_argument("limit", type=int, default=20)

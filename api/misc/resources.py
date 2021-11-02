from io import StringIO
from flask_restful import Resource

from flask import make_response
from api.misc.requestParsers import DbConnCheckerParser, DbDataPreviewParser
from lib.integrations.DataSourceFactory import DatasourceFactory


class DbConnectionCheckerAPI(Resource):
    def post(self):
        args: dict = DbConnCheckerParser.parse_args()
        db_type = args.pop("type")
        ds = DatasourceFactory.get_datasource(db_type, **args)
        try:
            is_connected, error = ds.check_connection()
            return (
                {"connected": is_connected}
                if is_connected
                else {"connected": is_connected, "error": str(error)}
            )
        except Exception as e:
            print(e)


class DbDataPreviewAPI(Resource):
    def post(self):
        args: dict = DbDataPreviewParser.parse_args()
        db_type = args.pop("type")
        ds = DatasourceFactory.get_datasource(db_type, **args)
        preview_dataset = ds.preview_dataset(args.get("query"), args.get("limit"))
        si = StringIO()
        preview_dataset.to_csv(si, index=False)
        output = make_response(si.getvalue())
        output.headers["Content-type"] = "text/csv"
        return output

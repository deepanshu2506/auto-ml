from flask_restful import Resource

from api.misc.requestParsers import DbConnCheckerParser
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

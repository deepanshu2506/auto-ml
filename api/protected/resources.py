from flask_jwt_extended.utils import get_jwt_identity
from flask_restful import Resource
from flask_jwt_extended import jwt_required
class ProtectedAPI(Resource):
    @jwt_required()
    def get(self):
        return f"{get_jwt_identity()} protected"
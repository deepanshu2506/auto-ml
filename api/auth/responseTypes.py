from flask_restful import fields


UserProfile = {"username": fields.String}
UserLoginAPIResponse = {"token": fields.String, "profile": fields.Nested(UserProfile)}

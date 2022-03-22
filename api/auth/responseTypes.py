from flask_restful import fields


UserProfile =  {"username": fields.String,"confirmed":fields.Boolean, "confirmedOn":fields.DateTime}
UserLoginAPIResponse = {"token": fields.String, "profile": fields.Nested(UserProfile)}
EmailConfirmAPIResponse = { "profile": fields.Nested(UserProfile)}
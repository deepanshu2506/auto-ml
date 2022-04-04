from itsdangerous import URLSafeTimedSerializer
from config import Config
from flask import current_app as app


class AuthService:
    def __init__(self) -> None:
        pass
           
    def generate_confirmation_token(self,email):
        print(email)
        serializer = URLSafeTimedSerializer(Config.SECRET_KEY)
        return serializer.dumps(email, salt=Config.SECURITY_PASSWORD_SALT)

    def confirm_token(self,token, expiration=86400):
        #1 day validation 
        serializer = URLSafeTimedSerializer(Config.SECRET_KEY)
        email = serializer.loads(
            token,
            salt=Config.SECURITY_PASSWORD_SALT,
            max_age=expiration
        )    
        return email
    

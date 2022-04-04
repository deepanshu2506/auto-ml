import os


class Config:
    MONGODB_SETTINGS = {
        "db": os.environ.get("DB_NAME"),
        "host": "localhost",
        "port": "27017",
    }

    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")

    UPLOAD_DIRECTORY = os.environ.get("UPLOAD_DIR") or "./uploads"

    MODEL_SAVE_DIRECTORY = os.environ.get("MODEL_SAVE_DIR") or "./models"

    README_SAVE_DIRECTORY = os.environ.get("README_SAVE_DIR") or "./readme"

    """Base configuration."""
    # main config
    SECRET_KEY = os.environ.get("SECRET_KEY")
    SECURITY_PASSWORD_SALT = os.environ.get("SECURITY_PASSWORD_SALT")
    DEBUG = False
    BCRYPT_LOG_ROUNDS = 13
    WTF_CSRF_ENABLED = True
    DEBUG_TB_ENABLED = False
    DEBUG_TB_INTERCEPT_REDIRECTS = False
import os
class Config:
    MONGODB_SETTINGS= {
        "db":os.environ.get("DB_NAME"),
        'host':'localhost',
        'port':'27017'
    }

    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
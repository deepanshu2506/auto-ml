from config import Config
from mongoengine.connection import connect
from db.models.User import User
from flask import Flask
from flask_mongoengine import MongoEngine

class DBUtils:
    

    @staticmethod
    def init():
        print("connecting to db")
        connect(Config.MONGODB_SETTINGS['db'])
        print("db connected")
        
        
    @staticmethod
    def getDb()->MongoEngine:
        if(DBUtils._db is None):
            raise BaseException("Db not connected")
        else: return DBUtils._db

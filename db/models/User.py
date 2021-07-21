from mongoengine import Document
from mongoengine.fields import DateTimeField, EmailField, StringField
import datetime
import bcrypt
class User(Document):
    username =StringField()
    email = EmailField()
    password = StringField(required=True)
    dateCreated = DateTimeField(default=datetime.datetime.utcnow) 

    def hash_password(self):
        salt = bcrypt.gensalt()
        self.password = bcrypt.hashpw(self.password.encode('utf-8'),salt=salt).decode('utf-8')

    def check_password(self,password):
        return bcrypt.checkpw(password=password.encode('utf-8') , hashed_password=self.password.encode('utf-8'))
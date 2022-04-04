from config import Config
from flask_mail import Message,Mail
from flask import current_app as app
import os

def send_email(to, subject, template):
    msg = Message(
        subject,
        recipients=[to],
        html=template,
        # body=template,
        sender= 'noreply@datagenie.com'
    )
    app.config.update(dict(
    DEBUG = True,
    MAIL_SERVER = 'smtp.gmail.com',
    MAIL_PORT = 587,
    MAIL_USE_TLS = True,
    MAIL_USE_SSL = False,
    MAIL_USERNAME = os.environ.get('APP_MAIL_USERNAME'),
    MAIL_PASSWORD = os.environ.get('APP_MAIL_PASSWORD'),
    MAIL_DEFAULT_SENDER='noreply@datagenie.com'

    ))
    mail=Mail(app)
    mail.send(msg)
    print("Mail Sent")
    
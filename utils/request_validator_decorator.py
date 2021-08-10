import functools
from typing import Any, Callable
from flask_restful import abort, reqparse
from flask import jsonify


def handle_validation_error(error: Exception):
    abort(400, message=error.args[0])


def RequestValidator(parser: reqparse.RequestParser, validator: Callable[[Any], None]):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            req_args = parser.parse_args()
            try:

                validator(**req_args)
            except Exception as error:
                handle_validation_error(error)
            return func(*args, **kwargs)

        return wrapper

    return decorator

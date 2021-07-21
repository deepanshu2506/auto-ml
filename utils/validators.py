import re
from utils.exceptions import APIInputValidationError
def password_validator(value:str):
    match = re.match("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})",value)
    if not match:  
        raise APIInputValidationError("Password not valid")
    return value.lower()
        
# utils/jwt_utils.py
# Contains utility to generate JSON Web Tokens (JWT)

import jwt
import datetime
from flask import current_app
from jwt import ExpiredSignatureError, InvalidTokenError 

def generate_jwt_token(user_id, role):
    """
    Generates a JWT token containing the user's ID and role.
    Token is valid for 1 day.
    """
    payload = {
        'id': user_id,
        'role': role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }

    # SECRET_KEY is loaded from config.py via current_app context
    token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')

    return token

def decode_jwt(token):
    """
    Decodes a JWT token and returns the payload.
    Raises exceptions if token is expired or invalid.
    """
    try:
        return jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
    except ExpiredSignatureError:
        raise ExpiredSignatureError("Token expired")
    except InvalidTokenError:
        raise InvalidTokenError("Invalid token")

# config.py
# Contains all environment-specific Flask app configurations

import os
from dotenv import load_dotenv

# Load .env values
load_dotenv()

# Base config class
class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    ENV = os.getenv("FLASK_ENV", "production")  # default to production


# Development config (used by default)
# class DevConfig(Config):
#     DEBUG = True

# For production (if needed later)
class ProdConfig(Config):
    DEBUG = False

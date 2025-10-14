# models/__init__.py
# Initializes SQLAlchemy and makes it available to other modules

from flask_sqlalchemy import SQLAlchemy

# Create a SQLAlchemy instance
db = SQLAlchemy()

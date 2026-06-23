from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from infrastructure.utils.config import config

# Secondary engine for the Official Postgres DB (Read-Only)
OFFICIAL_DB_URL = config.OFFICIAL_DATABASE_URL

# Default to a mock or empty string if not provided to avoid crash during setup
if not OFFICIAL_DB_URL:
    # Use an in-memory sqlite as a fallback for dev if URL is missing
    OFFICIAL_DB_URL = "sqlite:///:memory:"

official_engine = create_engine(OFFICIAL_DB_URL)
SessionLocalOfficial = sessionmaker(autocommit=False, autoflush=False, bind=official_engine)

OfficialBase = declarative_base()

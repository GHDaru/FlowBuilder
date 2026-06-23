import sys
import os
from pathlib import Path

# Add backend root to path
backend_path = Path(__file__).parent.parent
sys.path.append(str(backend_path))

from infrastructure.database.connection import init_db
from infrastructure.utils.config import config

def reset_database():
    db_path = config.DB_PATH
    print(f"Target database path: {db_path}")
    if os.path.exists(db_path):
        print("Removing existing database...")
        os.remove(db_path)
    
    print("Initializing fresh database with updated schema...")
    init_db()
    print("✅ Database successfully recreated!")

if __name__ == "__main__":
    reset_database()

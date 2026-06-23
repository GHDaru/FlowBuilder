import os
from pathlib import Path
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

# Load paths
current_dir = Path(__file__).parent.resolve()
backend_root = None
for p in [current_dir] + list(current_dir.parents):
    if p.name == "backend":
        backend_root = p
        break

if not backend_root:
    backend_root = current_dir.parent.parent.parent

workspace_root = backend_root.parent if (backend_root.parent / "data").exists() else backend_root

class Config(BaseSettings):
    # AI Providers
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-4o-mini"
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-2.0-flash"
    
    # Paths
    PROMPTS_PATH: Path = workspace_root / "data" / "prompts"
    LOCAL_PROMPTS_PATH: Path = backend_root / "data" / "prompts"
    DB_PATH: Path = backend_root / "audit.db"
    
    # Database
    # Use a specific variable for aitest to avoid collisions with Java core .env
    AITEST_DATABASE_URL: Optional[str] = None
    DATABASE_URL: str = "" # Computed in __init__
    OFFICIAL_DATABASE_URL: Optional[str] = None
    
    # Environment
    APP_ENV: str = "local"

    model_config = SettingsConfigDict(
        env_file=workspace_root / ".env",
        env_file_encoding='utf-8',
        extra='ignore'
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Default to SQLite for zero friction in the AI Lab
        if not self.AITEST_DATABASE_URL:
            if os.environ.get("VERCEL"):
                # On Vercel, copy database to /tmp so it's writeable
                tmp_db = Path("/tmp/audit.db")
                if not tmp_db.exists() and self.DB_PATH.exists():
                    import shutil
                    try:
                        shutil.copy2(self.DB_PATH, tmp_db)
                    except Exception as e:
                        print(f"⚠️ Error copying DB to /tmp: {e}")
                self.DATABASE_URL = f"sqlite:///{tmp_db}"
            else:
                self.DATABASE_URL = f"sqlite:///{self.DB_PATH}"
        else:
            self.DATABASE_URL = self.AITEST_DATABASE_URL
            
        # Fix legacy postgres:// URL if present in the override
        if self.DATABASE_URL.startswith("postgres://"):
            self.DATABASE_URL = self.DATABASE_URL.replace("postgres://", "postgresql://", 1)
            
        if self.OFFICIAL_DATABASE_URL and self.OFFICIAL_DATABASE_URL.startswith("postgres://"):
            self.OFFICIAL_DATABASE_URL = self.OFFICIAL_DATABASE_URL.replace("postgres://", "postgresql://", 1)

    def validate_setup(self):
        """Basic validation to ensure critical setup is present."""
        if not self.OPENAI_API_KEY:
            print("⚠️ Warning: OPENAI_API_KEY not found in environment.")
        if not self.PROMPTS_PATH.exists():
            print(f"⚠️ Warning: Prompts directory not found at {self.PROMPTS_PATH}")

config = Config()
config.validate_setup()

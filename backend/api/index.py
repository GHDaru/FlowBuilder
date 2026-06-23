import sys
import os
from pathlib import Path

# Add backend directory to path so main can be imported
backend_dir = Path(__file__).parent.parent.resolve()
sys.path.append(str(backend_dir))

from main import app

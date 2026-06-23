import os
import shutil
from pathlib import Path

def sync_prompts():
    # Correct root path calculation (5 parents to repo root from this script location if it was in aitest/src/...)
    # But this script is in aitest/scripts/
    root_path = Path(__file__).parent.parent.parent
    source_dir = root_path / "src" / "main" / "resources" / "prompts"
    target_dir = root_path / "aitest" / "data" / "prompts"

    print(f"Syncing prompts from {source_dir} to {target_dir}...")

    if not source_dir.exists():
        print(f"Error: Source directory {source_dir} does not exist.")
        return

    os.makedirs(target_dir, exist_ok=True)

    count = 0
    for file in source_dir.glob("*.md"):
        shutil.copy2(file, target_dir)
        print(f"  Copied: {file.name}")
        count += 1
    
    for file in source_dir.glob("*.txt"):
        shutil.copy2(file, target_dir)
        print(f"  Copied: {file.name}")
        count += 1

    print(f"Done! {count} prompts synced.")

if __name__ == "__main__":
    sync_prompts()

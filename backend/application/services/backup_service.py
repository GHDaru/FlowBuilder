import json
import os
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from infrastructure.database.connection import Flow, RuleTable

class DatabaseBackupService:
    def __init__(self, db: Session, backup_dir: str = "data/backups"):
        self.db = db
        self.backup_path = Path(backup_dir)
        self.backup_path.mkdir(parents=True, exist_ok=True)

    def backup_data(self) -> str:
        """
        Exports all Flows and Rules to a JSON file.
        """
        flows = self.db.query(Flow).all()
        rules = self.db.query(RuleTable).all()

        data = {
            "version": "1.0",
            "timestamp": datetime.utcnow().isoformat(),
            "flows": [
                {
                    "id": f.id,
                    "name": f.name,
                    "description": f.description,
                    "json_definition": f.json_definition
                } for f in flows
            ],
            "rules": [
                {
                    "id": r.id,
                    "name": r.name,
                    "text": r.text,
                    "dimension": r.dimension,
                    "scope": r.scope,
                    "context": r.context,
                    "is_active": r.is_active,
                    "origin_json": r.origin_json
                } for r in rules
            ]
        }

        filename = f"backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        latest_file = self.backup_path / "latest_backup.json"
        dated_file = self.backup_path / filename

        with open(dated_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        # Copy to latest
        with open(latest_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        print(f"[BACKUP] Data saved to {dated_file}")
        return str(dated_file)

    def restore_data(self):
        """
        Imports Flows and Rules from latest_backup.json if database is empty.
        """
        latest_file = self.backup_path / "latest_backup.json"
        if not latest_file.exists():
            print("[RESTORE] No backup file found. Skipping.")
            return

        # Check if database is already populated
        if self.db.query(Flow).count() > 0 or self.db.query(RuleTable).count() > 0:
            print("[RESTORE] Database already has data. Skipping restore to prevent duplicates.")
            return

        print(f"[RESTORE] Restoring data from {latest_file}...")
        with open(latest_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        for f_data in data.get("flows", []):
            flow = Flow(
                id=f_data["id"],
                name=f_data["name"],
                description=f_data["description"],
                json_definition=f_data["json_definition"]
            )
            self.db.add(flow)

        for r_data in data.get("rules", []):
            rule = RuleTable(
                id=r_data["id"],
                name=r_data["name"],
                text=r_data["text"],
                dimension=r_data["dimension"],
                scope=r_data["scope"],
                context=r_data["context"],
                is_active=r_data["is_active"],
                origin_json=r_data["origin_json"]
            )
            self.db.add(rule)

        self.db.commit()
        print(f"[RESTORE] Successfully restored {len(data.get('flows', []))} flows and {len(data.get('rules', []))} rules.")

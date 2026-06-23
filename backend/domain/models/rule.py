from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional, Dict, Any
import uuid

@dataclass
class RuleOrigin:
    type: str  # 'manual' or 'feedback'
    atendimento_ref: Optional[str] = None
    feedback_original: Optional[str] = None

@dataclass
class Rule:
    name: str
    text: str
    dimension: str  # e.g., 'comunicacao_clareza', 'todas'
    scope: str  # 'global' | 'especifico'
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    context: Optional[str] = None
    is_active: bool = True
    origin: Optional[RuleOrigin] = None
    created_at: datetime = field(default_factory=datetime.utcnow)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "text": self.text,
            "dimension": self.dimension,
            "scope": self.scope,
            "context": self.context,
            "is_active": self.is_active,
            "origin": {
                "type": self.origin.type,
                "atendimento_ref": self.origin.atendimento_ref,
                "feedback_original": self.origin.feedback_original
            } if self.origin else None,
            "created_at": self.created_at.isoformat()
        }

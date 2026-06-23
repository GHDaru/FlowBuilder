from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class OfficialFirm(BaseModel):
    id: str
    name: str
    evaluation_count: int

class OfficialInteraction(BaseModel):
    id: int
    ticket_id: str
    has_evaluation: bool
    created_at: Optional[datetime]
    nota_media: Optional[float] = None
    nota_comunicacao: Optional[float] = None
    nota_profissionalismo: Optional[float] = None
    nota_resolucao: Optional[float] = None

class ProcessRequest(BaseModel):
    flow_id: str
    interaction_ids: List[int]

class ProcessResponse(BaseModel):
    execution_id: int
    tracking_ids: List[str]

class OfficialVariable(BaseModel):
    id: str
    label: str
    description: str

from pydantic import BaseModel, Field
from typing import List, Optional

class Metadata(BaseModel):
    data_atendimento: Optional[str] = None
    cliente: Optional[str] = None
    numero_ticket: Optional[str] = None

class Classification(BaseModel):
    servico_principal: str
    marcadores: List[str] = Field(default_factory=list)

class Score(BaseModel):
    dimensao: str
    nota: float
    justificativa: str

class TokenUsage(BaseModel):
    input_tokens: int = 0
    output_tokens: int = 0

    def add(self, other: 'TokenUsage'):
        self.input_tokens += other.input_tokens
        self.output_tokens += other.output_tokens

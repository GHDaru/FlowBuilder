import uuid
from typing import List, Optional
from pydantic import BaseModel, Field
from domain.models.value_objects import Metadata, Classification, Score, TokenUsage

class Atendimento(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    source_content: str
    filename: str
    execution_id: int
    metadata: Optional[Metadata] = None
    classification: Optional[Classification] = None
    scores: List[Score] = Field(default_factory=list)
    final_score: float = 0.0
    token_usage: TokenUsage = Field(default_factory=TokenUsage)
    summary: Optional[str] = None
    status: str = "PENDING"  # PENDING, RUNNING, COMPLETED, FAILED

    def add_score(self, score: Score):
        self.scores.append(score)
        self._calculate_final_score()

    def _calculate_final_score(self):
        if not self.scores:
            self.final_score = 0.0
            return
        self.final_score = round(sum(s.nota for s in self.scores) / len(self.scores), 2)

    def add_token_usage(self, usage: TokenUsage):
        self.token_usage.add(usage)

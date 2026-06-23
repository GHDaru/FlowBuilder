import json
from typing import List, Optional
from sqlalchemy.orm import Session
from domain.ports.repository import IAtendimentoRepository
from domain.models.atendimento import Atendimento as DomainAtendimento
from domain.models.rule import EvaluationRule as DomainRule
from domain.models.value_objects import Metadata, Classification, Score, TokenUsage
from infrastructure.database.connection import Atendimento as ORMAtendimento, EvaluationRuleTable as ORMRule

class SQLiteRepository(IAtendimentoRepository):
    """
    SQLite-specific implementation of the Atendimento Repository.
    Currently uses SQLAlchemy but is isolated as a specific adapter for the local AI Lab.
    """
    def __init__(self, db: Session):
        self.db = db

    def save(self, atendimento: DomainAtendimento) -> DomainAtendimento:
        orm_atendimento = self.db.query(ORMAtendimento).filter(ORMAtendimento.uuid == atendimento.id).first()
        
        if not orm_atendimento:
            orm_atendimento = ORMAtendimento(uuid=atendimento.id)
            self.db.add(orm_atendimento)

        orm_atendimento.execution_id = atendimento.execution_id
        orm_atendimento.filename = atendimento.filename
        orm_atendimento.content = atendimento.source_content
        orm_atendimento.final_score = atendimento.final_score
        orm_atendimento.summary = atendimento.summary
        orm_atendimento.status = atendimento.status
        orm_atendimento.input_tokens = atendimento.token_usage.input_tokens
        orm_atendimento.output_tokens = atendimento.token_usage.output_tokens
        
        if atendimento.metadata:
            orm_atendimento.metadata_json = atendimento.metadata.model_dump_json()
        if atendimento.classification:
            orm_atendimento.classification_json = atendimento.classification.model_dump_json()
        
        orm_atendimento.scores_json = json.dumps([s.model_dump() for s in atendimento.scores])

        self.db.commit()
        return atendimento

    def get_by_id(self, id: str) -> Optional[DomainAtendimento]:
        orm_atendimento = self.db.query(ORMAtendimento).filter(ORMAtendimento.uuid == id).first()
        if not orm_atendimento:
            return None
        
        domain = DomainAtendimento(
            id=orm_atendimento.uuid,
            source_content=orm_atendimento.content,
            filename=orm_atendimento.filename,
            execution_id=orm_atendimento.execution_id,
            status=orm_atendimento.status,
            final_score=orm_atendimento.final_score,
            summary=orm_atendimento.summary
        )
        
        if orm_atendimento.metadata_json:
            domain.metadata = Metadata.model_validate_json(orm_atendimento.metadata_json)
        if orm_atendimento.classification_json:
            domain.classification = Classification.model_validate_json(orm_atendimento.classification_json)
        if orm_atendimento.scores_json:
            scores_data = json.loads(orm_atendimento.scores_json)
            domain.scores = [Score(**s) for s in scores_data]
            
        domain.token_usage = TokenUsage(
            input_tokens=orm_atendimento.input_tokens or 0,
            output_tokens=orm_atendimento.output_tokens or 0
        )
        
        return domain

    def list_rules(self) -> List[DomainRule]:
        orm_rules = self.db.query(ORMRule).filter(ORMRule.is_active == 1).all()
        return [
            DomainRule(
                id=r.uuid,
                service_name=r.service_name,
                dimensions=json.loads(r.dimensions_json),
                is_active=True
            ) for r in orm_rules
        ]

    def save_rule(self, rule: DomainRule) -> DomainRule:
        orm_rule = self.db.query(ORMRule).filter(ORMRule.uuid == rule.id).first()
        if not orm_rule:
            orm_rule = ORMRule(uuid=rule.id)
            self.db.add(orm_rule)
        
        orm_rule.service_name = rule.service_name
        orm_rule.dimensions_json = json.dumps(rule.dimensions)
        orm_rule.is_active = 1 if rule.is_active else 0
        
        self.db.commit()
        return rule

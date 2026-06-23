import json
from typing import List, Optional
from sqlalchemy.orm import Session
from domain.models.rule import Rule, RuleOrigin
from domain.ports.rule_repository import IRuleRepository
from infrastructure.database.connection import RuleTable

class SqliteRuleRepository(IRuleRepository):
    def __init__(self, db: Session):
        self.db = db

    def _to_domain(self, table: RuleTable) -> Rule:
        origin = None
        if table.origin_json:
            data = json.loads(table.origin_json)
            origin = RuleOrigin(
                type=data.get("type"),
                atendimento_ref=data.get("atendimento_ref"),
                feedback_original=data.get("feedback_original")
            )
        
        return Rule(
            id=table.id,
            name=table.name,
            text=table.text,
            dimension=table.dimension,
            scope=table.scope,
            context=table.context,
            is_active=bool(table.is_active),
            origin=origin,
            created_at=table.created_at
        )

    def save(self, rule: Rule) -> Rule:
        db_rule = self.db.query(RuleTable).filter(RuleTable.id == rule.id).first()
        
        origin_json = json.dumps({
            "type": rule.origin.type,
            "atendimento_ref": rule.origin.atendimento_ref,
            "feedback_original": rule.origin.feedback_original
        }) if rule.origin else None

        if db_rule:
            db_rule.name = rule.name
            db_rule.text = rule.text
            db_rule.dimension = rule.dimension
            db_rule.scope = rule.scope
            db_rule.context = rule.context
            db_rule.is_active = 1 if rule.is_active else 0
            db_rule.origin_json = origin_json
        else:
            db_rule = RuleTable(
                id=rule.id,
                name=rule.name,
                text=rule.text,
                dimension=rule.dimension,
                scope=rule.scope,
                context=rule.context,
                is_active=1 if rule.is_active else 0,
                origin_json=origin_json,
                created_at=rule.created_at
            )
            self.db.add(db_rule)
        
        self.db.commit()
        self.db.refresh(db_rule)
        return self._to_domain(db_rule)

    def get_by_id(self, rule_id: str) -> Optional[Rule]:
        db_rule = self.db.query(RuleTable).filter(RuleTable.id == rule_id).first()
        return self._to_domain(db_rule) if db_rule else None

    def list_all(self, scope: Optional[str] = None, context: Optional[str] = None) -> List[Rule]:
        query = self.db.query(RuleTable)
        if scope:
            query = query.filter(RuleTable.scope == scope)
        if context:
            query = query.filter(RuleTable.context == context)
        
        return [self._to_domain(r) for r in query.all()]

    def delete(self, rule_id: str) -> bool:
        db_rule = self.db.query(RuleTable).filter(RuleTable.id == rule_id).first()
        if db_rule:
            self.db.delete(db_rule)
            self.db.commit()
            return True
        return False

    def list_active_for_context(self, context: Optional[str] = None) -> List[Rule]:
        # Active Global Rules
        global_rules = self.db.query(RuleTable).filter(
            RuleTable.scope == 'global',
            RuleTable.is_active == 1
        ).all()
        
        # Active Specific Rules for this context
        specific_rules = []
        if context:
            specific_rules = self.db.query(RuleTable).filter(
                RuleTable.scope == 'especifico',
                RuleTable.context == context,
                RuleTable.is_active == 1
            ).all()
            
        return [self._to_domain(r) for r in global_rules + specific_rules]

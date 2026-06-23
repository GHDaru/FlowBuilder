from typing import List, Optional
from sqlalchemy.orm import Session
from domain.ports.flow_repository import IFlowRepository
from domain.models.flow import Flow as DomainFlow
from infrastructure.database.connection import Flow as ORMFlow

class SqliteFlowRepository(IFlowRepository):
    def __init__(self, db: Session):
        self.db = db

    def save(self, flow: DomainFlow) -> DomainFlow:
        # Check if exists
        db_flow = self.db.query(ORMFlow).filter(ORMFlow.id == flow.id).first()
        
        if db_flow:
            db_flow.name = flow.name
            db_flow.description = flow.description
            db_flow.json_definition = flow.json_definition
            db_flow.updated_at = flow.updated_at
        else:
            db_flow = ORMFlow(
                id=flow.id,
                name=flow.name,
                description=flow.description,
                json_definition=flow.json_definition,
                created_at=flow.created_at,
                updated_at=flow.updated_at
            )
            self.db.add(db_flow)
        
        self.db.commit()
        self.db.refresh(db_flow)
        return self._to_domain(db_flow)

    def get_by_id(self, flow_id: str) -> Optional[DomainFlow]:
        db_flow = self.db.query(ORMFlow).filter(ORMFlow.id == flow_id).first()
        return self._to_domain(db_flow) if db_flow else None

    def list_all(self) -> List[DomainFlow]:
        db_flows = self.db.query(ORMFlow).all()
        return [self._to_domain(f) for f in db_flows]

    def delete(self, flow_id: str) -> bool:
        db_flow = self.db.query(ORMFlow).filter(ORMFlow.id == flow_id).first()
        if db_flow:
            self.db.delete(db_flow)
            self.db.commit()
            return True
        return False

    def _to_domain(self, db_flow: ORMFlow) -> DomainFlow:
        return DomainFlow(
            id=db_flow.id,
            name=db_flow.name,
            description=db_flow.description,
            json_definition=db_flow.json_definition,
            created_at=db_flow.created_at,
            updated_at=db_flow.updated_at
        )

from sqlalchemy.orm import Session
from infrastructure.database.connection import Atendimento, AuditLog, Execution

def get_atendimento_by_id(db: Session, atendimento_id: int):
    return db.query(Atendimento).filter(Atendimento.id == atendimento_id).first()

def get_audit_logs_by_atendimento(db: Session, atendimento_id: int):
    return db.query(AuditLog).filter(AuditLog.atendimento_id == atendimento_id).order_by(AuditLog.id).all()

def get_executions(db: Session):
    return db.query(Execution).order_by(Execution.timestamp.desc()).all()

def get_atendimentos_by_execution(db: Session, execution_id: int):
    return db.query(Atendimento).filter(Atendimento.execution_id == execution_id).all()

import uuid
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from infrastructure.utils.config import config

Base = declarative_base()

def generate_uuid():
    return str(uuid.uuid4())

class Flow(Base):
    __tablename__ = 'flows'
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    description = Column(String)
    json_definition = Column(Text) # Unified JSON with nodes, edges and metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship remains for backward compatibility if needed, 
    # but US3 will prioritize json_definition.
    nodes = relationship("Node", back_populates="flow", cascade="all, delete-orphan")

class Node(Base):
    __tablename__ = 'nodes'
    
    id = Column(String, primary_key=True, default=generate_uuid)
    flow_id = Column(String, ForeignKey('flows.id'))
    sequence_num = Column(Integer, nullable=False)
    title = Column(String)
    prompt_template = Column(Text)
    variables_json = Column(Text) # List of variables
    output_schema_json = Column(Text) # JSON schema
    
    flow = relationship("Flow", back_populates="nodes")
    trace_logs = relationship("TraceLog", back_populates="node")

class Tracking(Base):
    __tablename__ = 'trackings'
    
    id = Column(String, primary_key=True, default=generate_uuid)
    atendimento_id = Column(String, index=True)
    execution_id = Column(Integer, ForeignKey('executions.id'))
    status = Column(String, default="PENDING") # PENDING, PROCESSING, COMPLETED, ERROR
    started_at = Column(DateTime, default=datetime.utcnow)
    finished_at = Column(DateTime)
    total_duration_ms = Column(Integer, default=0)
    flow_name = Column(String)
    metadata_json = Column(Text) # Cached Firm, Client, Attendant
    
    execution = relationship("Execution", back_populates="trackings")
    trace_logs = relationship("TraceLog", back_populates="tracking", cascade="all, delete-orphan")

class TraceLog(Base):
    __tablename__ = 'trace_logs'
    
    id = Column(String, primary_key=True, default=generate_uuid)
    tracking_id = Column(String, ForeignKey('trackings.id'))
    node_id = Column(String, ForeignKey('nodes.id'))
    node_label = Column(String, nullable=True)
    prompt_sent = Column(Text)
    response_raw = Column(Text)
    response_json = Column(Text)
    status = Column(String) # SUCCESS, ERROR
    error_message = Column(Text)
    duration_ms = Column(Integer, default=0)
    
    # Cost Tracking
    model_id = Column(String)
    input_tokens = Column(Integer, default=0)
    output_tokens = Column(Integer, default=0)
    thinking_tokens = Column(Integer, default=0)
    
    tracking = relationship("Tracking", back_populates="trace_logs")
    node = relationship("Node", back_populates="trace_logs")

class Execution(Base):
    __tablename__ = 'executions'
    
    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    folder_path = Column(String)
    model_name = Column(String)
    status = Column(String) # COMPLETED, FAILED, RUNNING
    total_files = Column(Integer, default=0)
    processed_files = Column(Integer, default=0)
    error_count = Column(Integer, default=0)
    
    atendimentos = relationship("Atendimento", back_populates="execution")
    trackings = relationship("Tracking", back_populates="execution")

class Atendimento(Base):
    __tablename__ = 'atendimentos'
    
    id = Column(Integer, primary_key=True)
    uuid = Column(String, unique=True, index=True) # Domain ID
    execution_id = Column(Integer, ForeignKey('executions.id'))
    filename = Column(String)
    content = Column(Text)
    final_score = Column(Float)
    summary = Column(Text)
    status = Column(String) # SUCCESS, ERROR
    
    # Observability
    input_tokens = Column(Integer, default=0)
    output_tokens = Column(Integer, default=0)
    
    # Domain Values (stored as JSON)
    metadata_json = Column(Text) # JSON string
    classification_json = Column(Text) # JSON string
    scores_json = Column(Text) # JSON string
    
    execution = relationship("Execution", back_populates="atendimentos")
    audit_logs = relationship("AuditLog", back_populates="atendimento")

class RuleTable(Base):
    __tablename__ = 'rules'
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    text = Column(Text, nullable=False)
    dimension = Column(String)
    scope = Column(String) # global, especifico
    context = Column(String, nullable=True)
    is_active = Column(Integer, default=1) # 1=True, 0=False
    origin_json = Column(Text) # JSON metadata
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = 'audit_logs'
    
    id = Column(Integer, primary_key=True)
    atendimento_id = Column(Integer, ForeignKey('atendimentos.id'))
    step_name = Column(String)
    prompt = Column(Text)
    response_raw = Column(Text)
    validation_status = Column(String) # VALID, INVALID
    error_message = Column(Text)
    
    atendimento = relationship("Atendimento", back_populates="audit_logs")

engine = create_engine(config.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    from application.services.backup_service import DatabaseBackupService
    db = SessionLocal()
    try:
        # 1. Perform backup of existing data before any potential structural changes
        backup_service = DatabaseBackupService(db)
        backup_service.backup_data()
        
        # 2. Re-create/Initialize tables
        Base.metadata.create_all(bind=engine)
        
        # 3. Restore data if tables were just created (empty)
        backup_service.restore_data()
    finally:
        db.close()

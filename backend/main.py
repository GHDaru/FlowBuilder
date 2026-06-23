import json
import asyncio
from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from infrastructure.database.connection import SessionLocal, Flow, Node, init_db, Tracking, TraceLog, Execution
from models import schemas, official_schemas
from infrastructure.utils.config import config
from infrastructure.utils.scanner import scan_atendimentos, extract_atendimento_id
from services.ia_client import get_ia_client
from infrastructure.adapters.sqlite_flow_repository import SqliteFlowRepository
from application.services.flow_lifecycle import FlowLifecycleUseCase
from application.services.flow_execution import FlowExecutionUseCase

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB on startup
    init_db()
    yield

app = FastAPI(title="NPS IA Visual Lab API", lifespan=lifespan)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://lab-nps.ottimizza.com.br", # Exemplo de domínio real
        "*" # Temporariamente liberado para facilitar o acesso do sócio
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_flow_service(db: Session = Depends(get_db)):
    from infrastructure.adapters.sqlite_flow_repository import SqliteFlowRepository
    from application.services.flow_lifecycle import FlowLifecycleUseCase
    repo = SqliteFlowRepository(db)
    return FlowLifecycleUseCase(repo)

def get_model_service():
    from domain.services.model_service import ModelService
    return ModelService()

def get_official_service(db: Session = Depends(get_db)):
    from infrastructure.adapters.postgres_adapter import PostgresAdapter
    from infrastructure.adapters.sqlite_flow_repository import SqliteFlowRepository
    from application.services.flow_execution import FlowExecutionUseCase
    from application.services.official_data_service import OfficialDataService
    
    port = PostgresAdapter()
    repo = SqliteFlowRepository(db)
    executor = FlowExecutionUseCase(repo)
    return OfficialDataService(port, executor)

def get_rule_repository(db: Session = Depends(get_db)):
    from domain.ports.rule_repository import IRuleRepository
    from infrastructure.adapters.sqlite_rule_repository import SqliteRuleRepository
    return SqliteRuleRepository(db)

# Rules Management Endpoints

@app.get("/rules", response_model=List[Dict[str, Any]])
def list_rules(repo: Any = Depends(get_rule_repository)):
    rules = repo.list_all()
    return [r.to_dict() for r in rules]

@app.post("/rules", response_model=Dict[str, Any])
def create_rule(data: Dict[str, Any], repo: Any = Depends(get_rule_repository)):
    from domain.models.rule import Rule, RuleOrigin
    origin = None
    if "origin" in data and data["origin"]:
        origin = RuleOrigin(**data["origin"])
    
    rule = Rule(
        name=data["name"],
        text=data["text"],
        dimension=data["dimension"],
        scope=data["scope"],
        context=data.get("context"),
        is_active=data.get("is_active", True),
        origin=origin
    )
    saved = repo.save(rule)
    return saved.to_dict()

@app.put("/rules/{rule_id}", response_model=Dict[str, Any])
def update_rule(rule_id: str, data: Dict[str, Any], repo: Any = Depends(get_rule_repository)):
    from domain.models.rule import Rule, RuleOrigin
    existing = repo.get_by_id(rule_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Rule not found")
    
    origin = None
    if "origin" in data and data["origin"]:
        origin = RuleOrigin(**data["origin"])

    updated = Rule(
        id=rule_id,
        name=data.get("name", existing.name),
        text=data.get("text", existing.text),
        dimension=data.get("dimension", existing.dimension),
        scope=data.get("scope", existing.scope),
        context=data.get("context", existing.context),
        is_active=data.get("is_active", existing.is_active),
        origin=origin or existing.origin
    )
    saved = repo.save(updated)
    return saved.to_dict()

@app.delete("/rules/{rule_id}")
def delete_rule(rule_id: str, repo: Any = Depends(get_rule_repository)):
    if repo.delete(rule_id):
        return {"status": "deleted"}
    raise HTTPException(status_code=404, detail="Rule not found")

# Rule Generation Endpoints

@app.post("/rules/generate/feedback")
async def generate_feedback_rule(request: Dict[str, Any]):
    from application.services.rule_generation_service import RuleGenerationService
    service = RuleGenerationService()
    rule = await service.generate_from_feedback(
        transcript=request["transcript"],
        evaluation=request["avaliacao_dimensao"],
        feedback=request["feedback_supervisor"],
        atendimento_ref=request["atendimento_ref"]
    )
    return rule.to_dict()

@app.post("/rules/generate/manual")
async def generate_manual_rule(request: Dict[str, Any]):
    from application.services.rule_generation_service import RuleGenerationService
    service = RuleGenerationService()
    return await service.refine_manual_rule(request["description"])

# Flow Endpoints
@app.get("/models", response_model=List[schemas.Model])
def list_available_models(service: Any = Depends(get_model_service)):
    return service.list_all_models()

@app.get("/official/firms", response_model=List[official_schemas.OfficialFirm])
def list_official_firms(search: Optional[str] = None, service: Any = Depends(get_official_service)):
    return service.get_firms(search)

@app.get("/official/firms/{firm_ids}/interactions", response_model=List[official_schemas.OfficialInteraction])
def list_official_interactions(firm_ids: str, service: Any = Depends(get_official_service)):
    # Split comma-separated IDs
    ids = [id.strip() for id in firm_ids.split(",")]
    return service.get_interactions(ids)

@app.get("/official/variables", response_model=List[official_schemas.OfficialVariable])
def list_official_variables(service: Any = Depends(get_official_service)):
    return service.get_available_variables()

@app.post("/official/process", response_model=official_schemas.ProcessResponse)
async def process_official_interactions(request: official_schemas.ProcessRequest, background_tasks: BackgroundTasks, service: Any = Depends(get_official_service)):
    return await service.trigger_processing(request.flow_id, request.interaction_ids, background_tasks)

@app.post("/tools/sql/preview", response_model=schemas.SqlPreviewResponse)
def preview_sql_query(request: schemas.SqlPreviewRequest):
    from application.services.sql_execution_service import SqlExecutionService
    try:
        json_data = SqlExecutionService.execute(
            database_type=request.database_type,
            connection_details=request.connection_details,
            query=request.sql_query,
            variables=request.variables
        )
        return {"success": True, "data": json_data}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/tools/sql/test-connection")
def test_sql_connection(request: schemas.SqlPreviewRequest):
    from application.services.sql_execution_service import SqlExecutionService
    try:
        SqlExecutionService.test_connection(
            database_type=request.database_type,
            connection_details=request.connection_details
        )
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/flows", response_model=schemas.Flow)
def create_flow(flow_create: schemas.FlowCreate, service: FlowLifecycleUseCase = Depends(get_flow_service)):
    print(f"Creating new flow: {flow_create.name}")
    return service.create_new(flow_create.name, flow_create.description, flow_create.json_definition or "{}")

@app.get("/flows", response_model=List[schemas.Flow])
def list_flows(service: FlowLifecycleUseCase = Depends(get_flow_service)):
    return service.list_flows()

@app.get("/flows/{flow_id}", response_model=schemas.Flow)
def get_flow(flow_id: str, service: FlowLifecycleUseCase = Depends(get_flow_service)):
    flow = service.get_flow(flow_id)
    if not flow:
        raise HTTPException(status_code=404, detail="Flow not found")
    return flow

@app.put("/flows/{flow_id}", response_model=schemas.Flow)
def update_flow(flow_id: str, flow_update: Dict[str, Any], service: FlowLifecycleUseCase = Depends(get_flow_service)):
    json_def = flow_update.get("json_definition")
    # If it's a dict, stringify it. If it's a string, use as is.
    if isinstance(json_def, dict):
        json_def = json.dumps(json_def)
    elif json_def is None:
        json_def = "{}"
        
    name = flow_update.get("name")
    flow = service.save_existing(flow_id, json_def, name)
    if not flow:
        raise HTTPException(status_code=404, detail="Flow not found")
    return flow

@app.post("/flows/{flow_id}/copy", response_model=schemas.Flow)
def copy_flow(flow_id: str, new_name_data: Dict[str, str], service: FlowLifecycleUseCase = Depends(get_flow_service)):
    new_name = new_name_data.get("name")
    if not new_name:
        raise HTTPException(status_code=400, detail="Name required for copy")
    flow = service.copy_flow(flow_id, new_name)
    if not flow:
        raise HTTPException(status_code=404, detail="Flow not found")
    return flow

@app.delete("/flows/{flow_id}")
def delete_flow(flow_id: str, service: FlowLifecycleUseCase = Depends(get_flow_service)):
    if not service.delete_flow(flow_id):
        raise HTTPException(status_code=404, detail="Flow not found")
    return {"message": "Flow deleted"}

# Execution Engine
async def run_flow_for_file(flow_id: str, file_path: str, tracking_id: str):
    from infrastructure.adapters.sqlite_flow_repository import SqliteFlowRepository
    from application.services.flow_execution import FlowExecutionUseCase
    
    db = SessionLocal()
    try:
        # Initial status
        tracking = db.query(Tracking).filter(Tracking.id == tracking_id).first()
        tracking.status = "PROCESSING"
        db.commit()

        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        repo = SqliteFlowRepository(db)
        executor = FlowExecutionUseCase(repo)
        executor.execute(flow_id, content, tracking_id, initial_metadata={"atendimento": content})
        
    except Exception as e:
        print(f"Error executing flow: {e}")
    finally:
        db.close()

# Assistance Endpoints
@app.post("/assist/node")
async def assist_node_creation(user_intent: str, previous_output: Optional[Dict[str, Any]] = None):
    ia_client = get_ia_client()
    
    # Load architect prompt
    prompt_path = config.LOCAL_PROMPTS_PATH / "System Architect.md"
    with open(prompt_path, 'r', encoding='utf-8') as f:
        architect_prompt = f.read()
    
    full_prompt = f"{architect_prompt}\n\n"
    if previous_output:
        full_prompt += f"SAÍDA DO NÓ ANTERIOR:\n{json.dumps(previous_output, indent=2)}\n\n"
    
    full_prompt += f"OBJETIVO DO USUÁRIO:\n{user_intent}\n\nLembre-se: responda APENAS o JSON."

    try:
        response_raw = ia_client.call_openai(full_prompt, json_mode=True)
        return json.loads(response_raw)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Assistance failed: {str(e)}")

@app.post("/flows/{flow_id}/run")
async def start_flow_run(flow_id: str, folder_path: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    files = scan_atendimentos(folder_path)
    if not files:
        raise HTTPException(status_code=400, detail="No files found in folder")
    
    # Create main execution record
    db_execution = Execution(
        folder_path=folder_path,
        status="RUNNING",
        total_files=len(files)
    )
    db.add(db_execution)
    db.commit()
    db.refresh(db_execution)

    trackings = []
    for file_path in files:
        atendimento_id = extract_atendimento_id(file_path)
        db_tracking = Tracking(
            atendimento_id=atendimento_id,
            execution_id=db_execution.id,
            status="PENDING"
        )
        db.add(db_tracking)
        db.commit()
        db.refresh(db_tracking)
        trackings.append(db_tracking.id)
        
        # Queue task
        background_tasks.add_task(run_flow_for_file, flow_id, str(file_path), db_tracking.id)
    
    return {"execution_id": db_execution.id, "tracking_ids": trackings}

# Tracking & History
@app.get("/trackings", response_model=List[schemas.Tracking])
def list_trackings(db: Session = Depends(get_db)):
    return db.query(Tracking).order_by(Tracking.started_at.desc()).all()

@app.get("/trackings/{tracking_id}/content")
def get_tracking_content(tracking_id: str, db: Session = Depends(get_db)):
    tracking = db.query(Tracking).filter(Tracking.id == tracking_id).first()
    if not tracking:
        raise HTTPException(status_code=404, detail="Tracking not found")
    
    # Heuristic: if it's a file-based run, read the file. 
    # Tracking atendimento_id stores the filename for local runs.
    execution = db.query(Execution).filter(Execution.id == tracking.execution_id).first()
    if execution and execution.folder_path:
        import os
        file_path = os.path.join(execution.folder_path, tracking.atendimento_id)
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                return {"content": f.read()}
                
    # Fallback to official DB if it was an official run (Interaction ID)
    # This requires looking up the interaction content via port
    return {"content": "Content not found or not available for this run type."}

@app.get("/trackings/{tracking_id}", response_model=schemas.Tracking)
def get_tracking(tracking_id: str, db: Session = Depends(get_db)):
    tracking = db.query(Tracking).filter(Tracking.id == tracking_id).first()
    if not tracking:
        raise HTTPException(status_code=404, detail="Tracking not found")
    return tracking

@app.get("/trackings/{tracking_id}/logs", response_model=List[schemas.TraceLog])
def get_tracking_logs(tracking_id: str, db: Session = Depends(get_db)):
    return db.query(TraceLog).filter(TraceLog.tracking_id == tracking_id).all()

@app.get("/trackings/{tracking_id}/summary")
def get_tracking_summary(tracking_id: str, db: Session = Depends(get_db)):
    logs = db.query(TraceLog).filter(TraceLog.tracking_id == tracking_id).all()
    
    total_input = sum(log.input_tokens for log in logs if log.input_tokens)
    total_output = sum(log.output_tokens for log in logs if log.output_tokens)
    total_thinking = sum(log.thinking_tokens for log in logs if log.thinking_tokens)
    
    node_details = []
    for log in logs:
        node_details.append({
            "node_id": log.node_id,
            "input_tokens": log.input_tokens,
            "output_tokens": log.output_tokens,
            "thinking_tokens": log.thinking_tokens
        })
        
    return {
        "tracking_id": tracking_id,
        "total_input_tokens": total_input,
        "total_output_tokens": total_output,
        "total_thinking_tokens": total_thinking,
        "node_details": node_details
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8003, reload=True)

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class MetadataOutput(BaseModel):
    numero_atendimento: Optional[str] = Field(None, description="Número do atendimento")
    atendente_principal: Optional[str] = Field(None, description="Nome do atendente")
    nome_cliente: Optional[str] = Field(None, description="Nome do cliente")
    data_atendimento: Optional[str] = Field(None, description="Data do atendimento")

class DimensionScoreOutput(BaseModel):
    dimensao: str = Field(..., description="Nome da dimensão avaliada")
    nota: float = Field(..., description="Nota atribuída", ge=0, le=10)
    justificativa: str = Field(..., description="Justificativa da nota")
    evidencias: List[str] = Field(default_factory=list, description="Evidências encontradas no texto")

class TagsOutput(BaseModel):
    servico_principal: str = Field(..., description="Serviço principal identificado")
    marcadores: List[str] = Field(default_factory=list, description="Lista de marcadores de erro ou categorias")

class FinalEvaluation(BaseModel):
    metadata: MetadataOutput
    tags: TagsOutput
    scores: List[DimensionScoreOutput]
    media: float
    resumo: str

# Visual Flow Builder Schemas

class NodeBase(BaseModel):
    sequence_num: int
    title: str
    prompt_template: str
    variables: List[str] = Field(default_factory=list)
    output_schema: Dict[str, Any] = Field(default_factory=dict)

class NodeCreate(NodeBase):
    pass

class Node(NodeBase):
    id: str
    flow_id: str

    class Config:
        from_attributes = True

class FlowBase(BaseModel):
    name: str
    description: Optional[str] = None
    json_definition: Optional[str] = None

class FlowCreate(FlowBase):
    pass

class Flow(FlowBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    nodes: List[Node] = Field(default_factory=list)

    class Config:
        from_attributes = True

class TrackingBase(BaseModel):
    atendimento_id: str
    execution_id: int

class Tracking(TrackingBase):
    id: str
    status: str
    started_at: datetime
    finished_at: Optional[datetime] = None
    total_duration_ms: int = 0
    flow_name: Optional[str] = None
    metadata_json: Optional[str] = None

    class Config:
        from_attributes = True

class Model(BaseModel):
    id: str
    name: str
    provider: str

class TraceLog(BaseModel):
    id: str
    tracking_id: str
    node_id: str
    node_label: Optional[str] = None
    prompt_sent: str
    response_raw: str
    response_json: Optional[str] = None
    status: str
    error_message: Optional[str] = None
    duration_ms: int = 0
    
    # Cost Tracking
    model_id: Optional[str] = None
    input_tokens: int = 0
    output_tokens: int = 0
    thinking_tokens: int = 0

    class Config:
        from_attributes = True

class SqlPreviewRequest(BaseModel):
    database_type: str
    connection_details: Dict[str, Any]
    sql_query: str
    variables: Dict[str, Any] = Field(default_factory=dict)

class SqlPreviewResponse(BaseModel):
    success: bool
    data: Optional[str] = None
    error: Optional[str] = None


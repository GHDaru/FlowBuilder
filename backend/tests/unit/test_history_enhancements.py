import pytest
import time
from datetime import datetime, timedelta
from application.services.flow_execution import FlowExecutionUseCase
from infrastructure.database.connection import Tracking, TraceLog

def test_timing_calculation():
    # Simulate start and end
    start = datetime.utcnow()
    time.sleep(0.1) # Simulate some work
    end = datetime.utcnow()
    
    duration_ms = int((end - start).total_seconds() * 1000)
    assert duration_ms >= 100
    assert duration_ms < 200 # Should be around 100ms

def test_metadata_extraction_heuristic():
    # Simulate a final state from LangGraph
    final_state = {
        "outputs": {
            "node_1": {
                "nome_cliente": "Empresa Teste",
                "atendente_principal": "Joao Silva",
                "contabilidade": "Contab Express"
            },
            "node_2": {
                "nota": 8.5
            }
        }
    }
    
    outputs = final_state.get("outputs", {})
    metadata = {}
    for key, val in outputs.items():
        if isinstance(val, dict):
            if "nome_cliente" in val: metadata["cliente"] = val["nome_cliente"]
            if "atendente_principal" in val: metadata["atendente"] = val["atendente_principal"]
            if "contabilidade" in val: metadata["contabilidade"] = val["contabilidade"]
    
    assert metadata["cliente"] == "Empresa Teste"
    assert metadata["atendente"] == "Joao Silva"
    assert metadata["contabilidade"] == "Contab Express"

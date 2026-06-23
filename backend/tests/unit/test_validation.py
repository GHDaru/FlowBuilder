import pytest
import json
from pydantic import ValidationError
from models.schemas import MetadataOutput, DimensionScoreOutput, TagsOutput

def test_metadata_validation():
    valid_data = {
        "numero_atendimento": "123",
        "atendente_principal": "João",
        "nome_cliente": "Maria",
        "data_atendimento": "2026-05-29"
    }
    metadata = MetadataOutput(**valid_data)
    assert metadata.numero_atendimento == "123"

def test_dimension_score_validation():
    valid_data = {
        "dimensao": "Comunicação",
        "nota": 8.5,
        "justificativa": "Boa comunicação.",
        "evidencias": ["Clareza", "Cordialidade"]
    }
    score = DimensionScoreOutput(**valid_data)
    assert score.nota == 8.5
    
    with pytest.raises(ValidationError):
        DimensionScoreOutput(dimensao="X", nota=11, justificativa="Y")

def test_tags_validation():
    valid_data = {
        "servico_principal": "FGTS",
        "marcadores": ["#ErroCalculo"]
    }
    tags = TagsOutput(**valid_data)
    assert tags.servico_principal == "FGTS"

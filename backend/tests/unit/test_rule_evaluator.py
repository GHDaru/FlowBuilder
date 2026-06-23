import pytest
from domain.services.rule_evaluator import RuleEvaluator
from domain.models.rule import EvaluationRule
from domain.models.value_objects import Classification

def test_rule_evaluator_exact_match():
    rules = [
        EvaluationRule(service_name="Folha", dimensions=["Dim1", "Dim2"]),
        EvaluationRule(service_name="FGTS", dimensions=["Dim3"])
    ]
    evaluator = RuleEvaluator(rules)
    
    classification = Classification(servico_principal="Folha", marcadores=[])
    dimensions = evaluator.get_dimensions_for_classification(classification)
    
    assert dimensions == ["Dim1", "Dim2"]

def test_rule_evaluator_case_insensitive():
    rules = [
        EvaluationRule(service_name="Folha", dimensions=["Dim1", "Dim2"])
    ]
    evaluator = RuleEvaluator(rules)
    
    classification = Classification(servico_principal="folha", marcadores=[])
    dimensions = evaluator.get_dimensions_for_classification(classification)
    
    assert dimensions == ["Dim1", "Dim2"]

def test_rule_evaluator_default_fallback():
    rules = [
        EvaluationRule(service_name="Folha", dimensions=["Dim1"])
    ]
    evaluator = RuleEvaluator(rules)
    
    classification = Classification(servico_principal="Outros", marcadores=[])
    dimensions = evaluator.get_dimensions_for_classification(classification)
    
    # Check if default dimensions are returned
    assert "Comunicação e Clareza" in dimensions
    assert "Resolução e Eficiência" in dimensions

def test_rule_evaluator_inactive_rule():
    rules = [
        EvaluationRule(service_name="Folha", dimensions=["Dim1"], is_active=False)
    ]
    evaluator = RuleEvaluator(rules)
    
    classification = Classification(servico_principal="Folha", marcadores=[])
    dimensions = evaluator.get_dimensions_for_classification(classification)
    
    # Should fallback to default because the rule is inactive
    assert "Comunicação e Clareza" in dimensions

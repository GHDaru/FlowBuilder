import pytest
from domain.services.flow_router_evaluator import FlowRouterEvaluator

def test_evaluate_simple_equals():
    state = {"status": "positive"}
    rules = [{"id": "r1", "variable": "status", "operator": "equals", "value": "positive"}]
    assert FlowRouterEvaluator.evaluate(state, rules) == "r1"

def test_evaluate_nested_equals():
    state = {"meta": {"score": 10}}
    rules = [{"id": "r1", "variable": "meta.score", "operator": "equals", "value": "10"}]
    assert FlowRouterEvaluator.evaluate(state, rules) == "r1"

def test_evaluate_with_braces():
    state = {"meta": {"score": 10}}
    rules = [{"id": "r1", "variable": "{{meta.score}}", "operator": "equals", "value": "10"}]
    assert FlowRouterEvaluator.evaluate(state, rules) == "r1"

def test_evaluate_default():
    state = {"status": "negative"}
    rules = [{"id": "r1", "variable": "status", "operator": "equals", "value": "positive"}]
    assert FlowRouterEvaluator.evaluate(state, rules) == "default"

def test_evaluate_not_found():
    state = {}
    rules = [{"id": "r1", "variable": "missing", "operator": "equals", "value": "something"}]
    assert FlowRouterEvaluator.evaluate(state, rules) == "default"

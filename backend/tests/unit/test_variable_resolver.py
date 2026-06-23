import pytest
from domain.services.variable_resolver import VariableResolver

def test_resolve_simple_key():
    data = {"name": "John"}
    assert VariableResolver.resolve(data, "name") == "John"
    assert VariableResolver.resolve(data, "{{name}}") == "John"

def test_resolve_nested_key():
    data = {"user": {"profile": {"name": "Alice"}}}
    assert VariableResolver.resolve(data, "user.profile.name") == "Alice"
    assert VariableResolver.resolve(data, "{{user.profile.name}}") == "Alice"

def test_resolve_missing_key():
    data = {"user": {"name": "John"}}
    assert VariableResolver.resolve(data, "user.age") is None
    assert VariableResolver.resolve(data, "missing.key") is None

def test_resolve_exact_match_with_dots():
    # Legacy support: if a key actually has a dot in it
    data = {"user.name": "LegacyAlice"}
    assert VariableResolver.resolve(data, "user.name") == "LegacyAlice"

def test_extract_variable_names():
    text = "Hello {{user.name}}, your role is {{ auth.role }}. Welcome {{user.name}}!"
    vars = VariableResolver.extract_variable_names(text)
    assert len(vars) == 2
    assert "user.name" in vars
    assert "auth.role" in vars

def test_extract_empty():
    assert VariableResolver.extract_variable_names("") == []
    assert VariableResolver.extract_variable_names("No variables here") == []

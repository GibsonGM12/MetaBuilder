"""Unit tests for TableManager."""

import pytest

from app.infrastructure.database.table_manager import TableManager


def test_resolve_type_text_with_max_length():
    result = TableManager._resolve_type("TEXT", 200)
    assert result == "VARCHAR(200)"


def test_resolve_type_text_default_length():
    result = TableManager._resolve_type("TEXT", None)
    assert result == "VARCHAR(255)"


def test_resolve_type_number():
    result = TableManager._resolve_type("NUMBER")
    assert result == "DECIMAL(18,6)"


def test_resolve_type_integer():
    result = TableManager._resolve_type("INTEGER")
    assert result == "INTEGER"


def test_resolve_type_date():
    result = TableManager._resolve_type("DATE")
    assert result == "DATE"


def test_resolve_type_boolean():
    result = TableManager._resolve_type("BOOLEAN")
    assert result == "BOOLEAN"


def test_resolve_type_invalid():
    with pytest.raises(ValueError, match="no soportado"):
        TableManager._resolve_type("INVALID_TYPE")

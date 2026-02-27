from unittest.mock import MagicMock

import pytest
from fastapi import HTTPException

from app.application.services.data_validator import validate_record
from app.infrastructure.database.models import EntityFieldModel


def _make_field(**kwargs):
    defaults = {
        "id": None,
        "entity_id": None,
        "name": "test_field",
        "display_name": "Test Field",
        "field_type": "TEXT",
        "is_required": False,
        "max_length": None,
        "column_name": "test_field",
        "display_order": 0,
    }
    defaults.update(kwargs)
    mock = MagicMock(spec=EntityFieldModel)
    for k, v in defaults.items():
        setattr(mock, k, v)
    return mock


class TestValidateRequired:
    def test_missing_required_field_raises(self):
        field = _make_field(name="nombre", column_name="nombre", is_required=True)
        with pytest.raises(HTTPException) as exc_info:
            validate_record([field], {})
        assert exc_info.value.status_code == 422

    def test_optional_field_can_be_omitted(self):
        field = _make_field(name="nombre", column_name="nombre", is_required=False)
        result = validate_record([field], {})
        assert result == {}

    def test_required_field_present(self):
        field = _make_field(name="nombre", column_name="nombre", is_required=True)
        result = validate_record([field], {"nombre": "Juan"})
        assert result == {"nombre": "Juan"}


class TestValidateTypes:
    def test_text_accepts_string(self):
        field = _make_field(name="desc", column_name="desc", field_type="TEXT")
        result = validate_record([field], {"desc": "hello"})
        assert result == {"desc": "hello"}

    def test_text_rejects_number(self):
        field = _make_field(name="desc", column_name="desc", field_type="TEXT")
        with pytest.raises(HTTPException) as exc_info:
            validate_record([field], {"desc": 123})
        assert exc_info.value.status_code == 422

    def test_number_accepts_int_and_float(self):
        field = _make_field(name="precio", column_name="precio", field_type="NUMBER")
        assert validate_record([field], {"precio": 10}) == {"precio": 10}
        assert validate_record([field], {"precio": 10.5}) == {"precio": 10.5}

    def test_integer_accepts_int(self):
        field = _make_field(name="edad", column_name="edad", field_type="INTEGER")
        assert validate_record([field], {"edad": 25}) == {"edad": 25}

    def test_integer_rejects_bool(self):
        field = _make_field(name="edad", column_name="edad", field_type="INTEGER")
        with pytest.raises(HTTPException):
            validate_record([field], {"edad": True})

    def test_boolean_accepts_bool(self):
        field = _make_field(name="activo", column_name="activo", field_type="BOOLEAN")
        assert validate_record([field], {"activo": True}) == {"activo": True}

    def test_boolean_rejects_string(self):
        field = _make_field(name="activo", column_name="activo", field_type="BOOLEAN")
        with pytest.raises(HTTPException):
            validate_record([field], {"activo": "true"})

    def test_date_accepts_iso_format(self):
        from datetime import date
        field = _make_field(name="fecha", column_name="fecha", field_type="DATE")
        assert validate_record([field], {"fecha": "2024-01-15"}) == {"fecha": date(2024, 1, 15)}

    def test_date_rejects_bad_format(self):
        field = _make_field(name="fecha", column_name="fecha", field_type="DATE")
        with pytest.raises(HTTPException):
            validate_record([field], {"fecha": "15/01/2024"})


class TestValidateMaxLength:
    def test_text_within_max_length(self):
        field = _make_field(name="code", column_name="code", field_type="TEXT", max_length=5)
        assert validate_record([field], {"code": "ABC"}) == {"code": "ABC"}

    def test_text_exceeds_max_length(self):
        field = _make_field(name="code", column_name="code", field_type="TEXT", max_length=3)
        with pytest.raises(HTTPException):
            validate_record([field], {"code": "ABCDEF"})


class TestValidateUnknownFields:
    def test_unknown_fields_rejected(self):
        field = _make_field(name="nombre", column_name="nombre")
        with pytest.raises(HTTPException) as exc_info:
            validate_record([field], {"nombre": "ok", "extra": "bad"})
        assert exc_info.value.status_code == 422

    def test_column_name_mapping(self):
        field = _make_field(name="full_name", column_name="col_full_name", field_type="TEXT")
        result = validate_record([field], {"full_name": "John"})
        assert result == {"col_full_name": "John"}

# TK-BE-019: Implementar DataValidator

## Información General

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-019 |
| **Tipo** | Backend |
| **Historia** | US-020 |
| **Título** | Implementar validador de datos dinámicos |
| **Responsable** | Backend Developer |
| **Estimación** | M (50 min) |
| **Dependencias** | TK-BE-011 |

## Descripción Técnica

Crear validador que verifique datos según metadatos de campos.

## Checklist de Implementación

- [ ] Crear `backend/app/application/services/data_validator.py`
- [ ] Implementar validación de campos requeridos
- [ ] Implementar validación de tipos de datos
- [ ] Implementar validación de max_length
- [ ] Retornar lista de errores descriptivos

## Definición de Terminado (DoD)

- [ ] Valida campos requeridos
- [ ] Valida tipos correctos
- [ ] Mensajes de error claros

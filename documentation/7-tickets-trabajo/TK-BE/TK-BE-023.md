# TK-BE-023: Implementar error handler global

## Información General

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-023 |
| **Tipo** | Backend |
| **Historia** | US-024 |
| **Título** | Implementar manejo global de errores |
| **Responsable** | Backend Developer |
| **Estimación** | S (20 min) |
| **Dependencias** | TK-BE-010 |

## Descripción Técnica

Crear middleware que capture excepciones y retorne respuestas consistentes.

## Checklist de Implementación

- [ ] Crear `backend/app/api/middleware/error_handler.py`
- [ ] Crear excepciones personalizadas (ValidationError, NotFoundError, etc.)
- [ ] Implementar exception handlers para cada tipo
- [ ] Formato de error consistente
- [ ] No exponer detalles internos en producción
- [ ] Registrar handlers en main.py

## Definición de Terminado (DoD)

- [ ] Errores retornan JSON consistente
- [ ] Status codes apropiados
- [ ] Errores 500 no exponen stack traces

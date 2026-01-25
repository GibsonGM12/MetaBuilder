# TK-BE-007: Crear DTOs de autenticación

## Información General

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-007 |
| **Tipo** | Backend |
| **Historia** | US-008 |
| **Título** | Crear DTOs Pydantic para auth |
| **Responsable** | Backend Developer |
| **Estimación** | S (15 min) |
| **Dependencias** | TK-BE-002 |

## Descripción Técnica

Crear modelos Pydantic para validar requests y responses de auth.

## Checklist de Implementación

- [ ] Crear `backend/app/application/dto/auth_dto.py`
- [ ] Crear RegisterRequest (username, email, password, role)
- [ ] Crear LoginRequest (username, password)
- [ ] Crear TokenResponse (token, token_type, expires_in, user)
- [ ] Crear UserResponse (id, username, email, role)
- [ ] Agregar validaciones (min length, etc.)

## Definición de Terminado (DoD)

- [ ] DTOs validan inputs correctamente
- [ ] Errores de validación son claros

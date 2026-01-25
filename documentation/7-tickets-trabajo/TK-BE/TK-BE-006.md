# TK-BE-006: Implementar AuthService

## Información General

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-006 |
| **Tipo** | Backend |
| **Historia** | US-007 |
| **Título** | Implementar servicio de autenticación |
| **Responsable** | Backend Developer |
| **Estimación** | M (30 min) |
| **Dependencias** | TK-BE-004, TK-BE-005, TK-DBA-003 |

## Descripción Técnica

Crear AuthService que coordine registro, login y validación.

## Checklist de Implementación

- [ ] Crear `backend/app/application/services/auth_service.py`
- [ ] Implementar `register(username, email, password, role) -> User`
- [ ] Implementar `login(username, password) -> TokenResponse`
- [ ] Validar username único antes de registrar
- [ ] Hashear password antes de guardar
- [ ] Generar JWT en login exitoso

## Definición de Terminado (DoD)

- [ ] Registro crea usuario con password hasheado
- [ ] Login retorna JWT válido
- [ ] Credenciales incorrectas lanzan excepción

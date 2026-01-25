# TK-BE-008: Crear AuthRouter con endpoints

## Información General

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-008 |
| **Tipo** | Backend |
| **Historia** | US-008 |
| **Título** | Crear router de autenticación |
| **Responsable** | Backend Developer |
| **Estimación** | M (25 min) |
| **Dependencias** | TK-BE-006, TK-BE-007 |

## Descripción Técnica

Crear router FastAPI con endpoints de registro y login.

## Checklist de Implementación

- [ ] Crear `backend/app/api/routers/auth.py`
- [ ] Implementar `POST /api/auth/register`
- [ ] Implementar `POST /api/auth/login`
- [ ] Inyectar AuthService como dependencia
- [ ] Manejar excepciones y retornar status codes apropiados
- [ ] Registrar router en main.py

## Definición de Terminado (DoD)

- [ ] Endpoints funcionan en Swagger
- [ ] Register retorna 201
- [ ] Login retorna 200 con token
- [ ] Credenciales incorrectas retornan 401

# TK-BE-010: Crear main.py de FastAPI

## Información General

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-010 |
| **Tipo** | Backend |
| **Historia** | US-008 |
| **Título** | Crear punto de entrada FastAPI |
| **Responsable** | Backend Developer |
| **Estimación** | S (15 min) |
| **Dependencias** | TK-BE-008 |

## Descripción Técnica

Crear archivo main.py con configuración de FastAPI.

## Checklist de Implementación

- [ ] Crear `backend/app/api/main.py`
- [ ] Instanciar FastAPI app con título y descripción
- [ ] Configurar CORS
- [ ] Registrar routers (auth)
- [ ] Crear endpoint de health check
- [ ] Probar con `uvicorn app.api.main:app --reload`

## Definición de Terminado (DoD)

- [ ] API arranca sin errores
- [ ] Swagger UI accesible en /docs
- [ ] CORS configurado

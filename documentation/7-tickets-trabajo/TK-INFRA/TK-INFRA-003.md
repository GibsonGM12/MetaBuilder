# TK-INFRA-003: Crear Dockerfile backend

## Información General

| Campo | Valor |
|-------|-------|
| **ID** | TK-INFRA-003 |
| **Tipo** | Infraestructura |
| **Historia** | US-038 |
| **Título** | Crear Dockerfile para backend |
| **Responsable** | DevOps |
| **Estimación** | S (15 min) |
| **Dependencias** | TK-BE-010 |

## Checklist de Implementación

- [ ] Crear `backend/Dockerfile`
- [ ] Multi-stage build
- [ ] Imagen base python:3.12-slim
- [ ] Instalar dependencias
- [ ] Exponer puerto 8000
- [ ] CMD para uvicorn

## Definición de Terminado (DoD)

- [ ] Docker build ejecuta sin errores
- [ ] Container inicia correctamente
- [ ] API responde en puerto configurado

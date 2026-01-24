# Ficha del Proyecto - MetaBuilder

## Información General

| Campo | Valor |
|-------|-------|
| **Nombre del proyecto** | MetaBuilder - Sistema Low-Code Platform |
| **Autor** | Gustavo |
| **Fecha de inicio** | Enero 2026 |
| **Versión del documento** | 1.0 |
| **Estado** | En desarrollo (MVP) |

---

## 1. Problema que Resuelve

### Contexto del problema

Las organizaciones frecuentemente necesitan crear aplicaciones administrativas para gestionar datos de negocio. El enfoque tradicional implica:

- **Ciclos largos de desarrollo**: Cada nueva entidad requiere crear modelos, migraciones, APIs, y UI
- **Dependencia de desarrolladores**: Cualquier cambio estructural requiere intervención técnica
- **Costos elevados**: Tiempo de desarrollo, testing, y deploy para cambios simples
- **Rigidez**: Dificultad para adaptarse a cambios de negocio rápidamente

### Solución propuesta

MetaBuilder permite a usuarios con perfil administrador definir entidades de negocio (tablas, campos, tipos) mediante una interfaz visual, generando automáticamente:

- Tablas en base de datos
- APIs CRUD
- Formularios de captura
- Listados con paginación

**Resultado**: Reducción del 80% en tiempo de implementación de nuevas entidades de datos.

---

## 2. Objetivos

### Objetivo Principal

Desarrollar una plataforma funcional que permita la definición dinámica de entidades de negocio y la gestión de sus datos sin modificar código fuente.

### Objetivos Secundarios

| ID | Objetivo | Métrica de éxito |
|----|----------|------------------|
| O-01 | Implementar arquitectura Clean Architecture | 4 capas claramente separadas |
| O-02 | Crear sistema de autenticación seguro | JWT con bcrypt funcionando |
| O-03 | Desarrollar motor de queries dinámicas | CRUD sobre cualquier entidad |
| O-04 | Generar UI dinámica desde metadatos | Formularios y listados automáticos |
| O-05 | Desplegar en producción | URL pública accesible |
| O-06 | Documentar completamente | README, API docs, backlog |

---

## 3. Stakeholders y Usuarios Objetivo

### Stakeholders

| Rol | Interés | Nivel de influencia |
|-----|---------|---------------------|
| Product Owner | Funcionalidad y alcance del MVP | Alto |
| Desarrolladores | Implementación técnica | Alto |
| Evaluadores/Profesores | Calidad técnica y documentación | Alto |
| Usuarios finales (demo) | Usabilidad del sistema | Medio |

### Usuarios Objetivo

| Persona | Descripción | Necesidades principales |
|---------|-------------|------------------------|
| **Administrador** | Usuario técnico que configura el sistema | Crear entidades, definir campos, gestionar estructura |
| **Usuario operativo** | Usuario de negocio que gestiona datos | Crear, editar, consultar, eliminar registros |

### Matriz RACI

| Actividad | PM | Backend Dev | Frontend Dev | DBA |
|-----------|-----|-------------|--------------|-----|
| Definir requisitos | R,A | C | C | C |
| Diseñar arquitectura | C | R,A | C | C |
| Implementar backend | I | R,A | I | C |
| Implementar frontend | I | C | R,A | I |
| Diseñar base de datos | C | C | I | R,A |
| Testing | A | R | R | C |
| Deploy | I | R | R | C |

*R=Responsable, A=Aprobador, C=Consultado, I=Informado*

---

## 4. Supuestos y Restricciones

### Supuestos

| ID | Supuesto | Impacto si es falso |
|----|----------|---------------------|
| S-01 | El equipo tiene conocimiento de Python/FastAPI | Retraso en implementación BE |
| S-02 | El equipo tiene conocimiento de React/TypeScript | Retraso en implementación FE |
| S-03 | PostgreSQL es suficiente para el MVP | Cambio de stack de BD |
| S-04 | 30 horas son suficientes para el MVP | Reducción de alcance |
| S-05 | Railway/Render tienen tier gratuito disponible | Buscar alternativa de hosting |

### Restricciones

| ID | Restricción | Tipo | Mitigación |
|----|-------------|------|------------|
| R-01 | Tiempo total: 30 horas | Tiempo | Priorización estricta, scope reducido |
| R-02 | Sin presupuesto para servicios pagos | Costo | Usar tiers gratuitos (Railway, Vercel) |
| R-03 | Equipo pequeño | Recurso | Automatización, reutilización |
| R-04 | Sin Keycloak (simplificación) | Técnica | JWT simple implementado manualmente |

---

## 5. Alcance

### In-Scope (Incluido en MVP)

| Área | Funcionalidad | Prioridad |
|------|---------------|-----------|
| **Auth** | Registro de usuarios | P0 |
| **Auth** | Login con JWT | P0 |
| **Auth** | Roles Admin/User | P0 |
| **Metadatos** | CRUD de entidades | P0 |
| **Metadatos** | CRUD de campos | P0 |
| **Metadatos** | Tipos: TEXT, NUMBER, INTEGER, DATE, BOOLEAN | P0 |
| **Metadatos** | Creación dinámica de tablas | P0 |
| **CRUD** | Crear registros | P0 |
| **CRUD** | Listar registros con paginación | P0 |
| **CRUD** | Obtener registro por ID | P0 |
| **CRUD** | Actualizar registros | P0 |
| **CRUD** | Eliminar registros (hard delete) | P0 |
| **Frontend** | Login page | P0 |
| **Frontend** | Admin de entidades | P0 |
| **Frontend** | Admin de campos | P0 |
| **Frontend** | Listado dinámico | P0 |
| **Frontend** | Formulario dinámico | P0 |
| **Infra** | Docker Compose local | P0 |
| **Infra** | Deploy en Railway/Render | P0 |

### Out-of-Scope (Excluido del MVP)

| Funcionalidad | Razón de exclusión | Fase futura |
|---------------|-------------------|-------------|
| Relaciones entre entidades (FK, 1-N, N-N) | Complejidad alta | v1.0 |
| Sistema de auditoría completo | Tiempo insuficiente | v1.0 |
| Rollback/Versionado de cambios | Tiempo insuficiente | v1.0 |
| Validaciones avanzadas (regex, custom) | Tiempo insuficiente | v1.0 |
| Soft deletes | Simplificación MVP | v1.0 |
| Filtros avanzados y búsqueda | Tiempo insuficiente | v1.0 |
| Reportes y métricas | Tiempo insuficiente | v2.0 |
| Vistas configurables | Complejidad alta | v2.0 |
| Webhooks y triggers | Complejidad alta | v2.0 |
| Internacionalización | Tiempo insuficiente | v2.0 |
| Tests unitarios extensivos | Tiempo limitado | v1.0 |

---

## 6. Dependencias

### Dependencias Internas

| ID | Dependencia | Afecta a | Tipo |
|----|-------------|----------|------|
| DI-01 | Schema de BD debe existir antes de APIs | Backend | Secuencial |
| DI-02 | APIs de metadatos antes de CRUD dinámico | Backend | Secuencial |
| DI-03 | Auth backend antes de frontend | Full stack | Secuencial |
| DI-04 | APIs completas antes de frontend CRUD | Full stack | Secuencial |

### Dependencias Externas

| ID | Dependencia | Proveedor | Riesgo | Mitigación |
|----|-------------|-----------|--------|------------|
| DE-01 | PostgreSQL 15+ | Docker Hub | Bajo | Imagen oficial estable |
| DE-02 | Python 3.12 | python.org | Bajo | Versión LTS |
| DE-03 | Node.js 18+ | nodejs.org | Bajo | Versión LTS |
| DE-04 | Railway/Render | Proveedor cloud | Medio | Alternativas: Fly.io, Azure |
| DE-05 | GitHub | Microsoft | Bajo | Servicio estable |

---

## 7. Riesgos Principales y Mitigaciones

| ID | Riesgo | Probabilidad | Impacto | Mitigación |
|----|--------|--------------|---------|------------|
| RI-01 | Tiempo insuficiente para completar MVP | Media | Alto | Priorización estricta, reducir scope si es necesario |
| RI-02 | Complejidad de queries dinámicas | Media | Alto | Prototipar temprano, usar SQLAlchemy Core |
| RI-03 | Problemas de rendimiento con DDL dinámico | Baja | Medio | Limitar operaciones DDL, cachear metadatos |
| RI-04 | SQL Injection en queries dinámicas | Media | Crítico | Usar parámetros SQLAlchemy, nunca concatenar |
| RI-05 | Servicio de hosting no disponible | Baja | Medio | Tener alternativas identificadas |
| RI-06 | Incompatibilidad de versiones de dependencias | Baja | Medio | Fijar versiones en requirements.txt |

### Plan de contingencia

1. **Si el tiempo es insuficiente**: Eliminar funcionalidades P1, mantener solo P0
2. **Si hay problemas técnicos graves**: Simplificar arquitectura, reducir capas
3. **Si el hosting falla**: Deploy local con ngrok para demo

---

## 8. Métricas de Éxito (KPIs)

### KPIs Funcionales

| Métrica | Objetivo | Medición |
|---------|----------|----------|
| Entidades creables | Mínimo 2 diferentes | Prueba manual |
| Campos por entidad | Mínimo 4 de tipos variados | Prueba manual |
| Operaciones CRUD | 100% funcionales | Test de integración |
| Tiempo de respuesta API | < 500ms | Monitoreo |
| Uptime en producción | > 95% | Monitoreo Railway |

### KPIs Técnicos

| Métrica | Objetivo | Medición |
|---------|----------|----------|
| Cobertura Clean Architecture | 4 capas implementadas | Revisión de código |
| Documentación API | 100% endpoints documentados | Swagger/OpenAPI |
| Errores en consola | 0 errores críticos | Prueba manual |
| Responsive design | Funcional en móvil | Prueba manual |

### KPIs de Proyecto

| Métrica | Objetivo | Medición |
|---------|----------|----------|
| Tiempo total invertido | ≤ 30 horas | Tracking de tiempo |
| Historias completadas | 100% de P0 | GitHub Projects |
| Deploy exitoso | Sistema accesible públicamente | URL funcional |

---

## 9. Estado Actual y Próximos Pasos

### Estado Actual

| Componente | Estado | Progreso |
|------------|--------|----------|
| Documentación de diseño | Completado | 100% |
| Backlog y user stories | Completado | 100% |
| Schema de base de datos | Diseñado | 100% |
| Backend - Estructura | Pendiente | 0% |
| Backend - Auth | Pendiente | 0% |
| Backend - Metadatos | Pendiente | 0% |
| Backend - CRUD | Pendiente | 0% |
| Frontend - Setup | Pendiente | 0% |
| Frontend - Auth | Pendiente | 0% |
| Frontend - Admin | Pendiente | 0% |
| Frontend - CRUD | Pendiente | 0% |
| Deploy | Pendiente | 0% |

### Próximos Pasos Inmediatos

| Paso | Responsable | Tiempo estimado |
|------|-------------|-----------------|
| 1. Crear repositorio GitHub | PM | 15 min |
| 2. Setup estructura backend | Backend Dev | 30 min |
| 3. Configurar Docker Compose | DevOps | 20 min |
| 4. Crear migraciones iniciales | DBA | 30 min |
| 5. Implementar auth endpoints | Backend Dev | 45 min |

### Hitos del Proyecto

| Hito | Descripción | Fecha objetivo |
|------|-------------|----------------|
| H1 | Setup completo + Auth funcionando | +4 horas |
| H2 | Backend completo con API funcional | +10 horas |
| H3 | Frontend básico funcionando E2E | +20 horas |
| H4 | Sistema completo con UX pulida | +28 horas |
| H5 | Deploy en producción + documentación | +30 horas |

---

## 10. Información de Contacto y Recursos

### Repositorio

- **URL**: [Pendiente]
- **Rama principal**: `main`
- **Rama de desarrollo**: `develop`

### Documentación

- **Backlog completo**: [documentation/readme.md](../readme.md)
- **Arquitectura**: [3-arquitectura/arquitectura.md](../3-arquitectura/arquitectura.md)
- **API Specification**: [5-especificacion-api/api-specification.md](../5-especificacion-api/api-specification.md)

### Herramientas

| Herramienta | Propósito | URL |
|-------------|-----------|-----|
| GitHub | Repositorio y Projects | github.com |
| Railway | Hosting backend + DB | railway.app |
| Vercel | Hosting frontend | vercel.com |
| Postman | Testing de APIs | postman.com |
| Swagger | Documentación API | /docs (auto-generado) |

---

*Última actualización: Enero 2026*

# Infraestructura y Despliegue

## Descripción General

Este documento describe la infraestructura, configuración y procesos de despliegue para la **Plataforma Low-Code basada en Metadatos (MetaBuilder)**. El sistema está diseñado para ser desplegado en múltiples entornos utilizando contenedores Docker y servicios cloud modernos.

---

## Entornos

El sistema soporta tres entornos principales, cada uno con sus propias características y propósitos:

### Desarrollo (Development)

| Aspecto | Configuración |
|---------|---------------|
| **Propósito** | Desarrollo local e iteración rápida |
| **Base de datos** | PostgreSQL 15+ en contenedor Docker |
| **Backend** | FastAPI con hot-reload (uvicorn --reload) |
| **Frontend** | Vite dev server con HMR |
| **Acceso** | localhost (backend: 8000, frontend: 5173) |
| **Datos** | Datos de prueba, puede resetearse |

```bash
# Levantar entorno de desarrollo
docker-compose up -d postgres
uvicorn app.main:app --reload --port 8000
cd frontend && npm run dev
```

### Staging (Pre-producción)

| Aspecto | Configuración |
|---------|---------------|
| **Propósito** | Pruebas de integración y validación pre-release |
| **Base de datos** | PostgreSQL gestionado (Railway/Render/Azure) |
| **Backend** | Contenedor Docker con configuración de staging |
| **Frontend** | Build de producción servido estáticamente |
| **Acceso** | URL pública de staging |
| **Datos** | Copia sanitizada de producción o datos de prueba |

### Producción (Production)

| Aspecto | Configuración |
|---------|---------------|
| **Propósito** | Sistema en vivo para usuarios finales |
| **Base de datos** | PostgreSQL gestionado con backups automáticos |
| **Backend** | Contenedores Docker con múltiples réplicas |
| **Frontend** | Build optimizado en CDN/Static hosting |
| **Acceso** | Dominio personalizado con HTTPS |
| **Datos** | Datos reales con políticas de retención |

---

## Infraestructura

### Proveedores Soportados

El sistema puede desplegarse en cualquiera de los siguientes proveedores:

#### Railway (Recomendado para MVP)

| Componente | Servicio Railway |
|------------|------------------|
| Backend | Web Service (Docker) |
| Base de datos | PostgreSQL Plugin |
| Frontend | Static Site o integrado |
| **Ventajas** | Deploy automático desde GitHub, PostgreSQL incluido, URL pública automática, tier gratuito disponible |

#### Render

| Componente | Servicio Render |
|------------|-----------------|
| Backend | Web Service |
| Base de datos | PostgreSQL (managed) |
| Frontend | Static Site |
| **Ventajas** | Tier gratuito generoso, auto-scaling, SSL automático |

#### Azure App Service

| Componente | Servicio Azure |
|------------|----------------|
| Backend | Azure App Service (Linux) |
| Base de datos | Azure Database for PostgreSQL Flexible Server |
| Frontend | Azure Static Web Apps |
| **Ventajas** | Integración enterprise, créditos de estudiante disponibles, GitHub Actions nativo |

### Servicios Utilizados

#### Compute

| Servicio | Tecnología | Propósito |
|----------|------------|-----------|
| **Backend API** | FastAPI (Python 3.12) | Servidor de aplicación REST |
| **Contenedores** | Docker + Docker Compose | Empaquetado y orquestación local |
| **Runtime** | Uvicorn/Gunicorn | Servidor ASGI de producción |

#### Storage

| Servicio | Tecnología | Propósito |
|----------|------------|-----------|
| **Base de datos** | PostgreSQL 15+ | Almacenamiento de metadatos y datos dinámicos |
| **Migraciones** | Alembic | Control de esquema de base de datos |
| **Archivos estáticos** | CDN/Static hosting | Assets del frontend |

#### Base de Datos

```
┌─────────────────────────────────────────────┐
│           PostgreSQL 15+                    │
├─────────────────────────────────────────────┤
│  Tablas de Sistema:                         │
│  - users (autenticación)                    │
│  - entities (metadatos de entidades)        │
│  - entity_fields (campos de entidades)      │
├─────────────────────────────────────────────┤
│  Tablas Dinámicas:                          │
│  - entity_{uuid} (generadas automáticamente)│
└─────────────────────────────────────────────┘
```

### Red y Seguridad

#### Arquitectura de Red

```
┌──────────────┐     HTTPS      ┌──────────────────┐
│   Cliente    │◄──────────────►│   Load Balancer  │
│   (Browser)  │                │   / CDN          │
└──────────────┘                └────────┬─────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
                    ▼                    ▼                    ▼
           ┌───────────────┐    ┌───────────────┐    ┌───────────────┐
           │   Frontend    │    │    Backend    │    │    Backend    │
           │   (Static)    │    │   (API #1)    │    │   (API #2)    │
           └───────────────┘    └───────┬───────┘    └───────┬───────┘
                                        │                    │
                                        └────────┬───────────┘
                                                 │
                                        ┌────────▼────────┐
                                        │   PostgreSQL    │
                                        │   (Private)     │
                                        └─────────────────┘
```

#### Políticas de Seguridad

| Aspecto | Implementación |
|---------|----------------|
| **Autenticación** | JWT (JSON Web Tokens) con expiración |
| **Autorización** | Control de acceso basado en roles (Admin/User) |
| **Comunicación** | HTTPS obligatorio en producción |
| **Base de datos** | Conexión privada, sin acceso público directo |
| **Secretos** | Variables de entorno, nunca en código |
| **CORS** | Configurado para dominios permitidos |
| **Contraseñas** | Hash bcrypt con salt |

---

## Proceso de Despliegue

### Estrategia de Despliegue

El proyecto utiliza **CI/CD con GitHub Actions** para automatizar el proceso de despliegue:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Commit    │───►│   Build &   │───►│   Deploy    │───►│   Verify    │
│   to main   │    │   Test      │    │   Staging   │    │   Health    │
└─────────────┘    └─────────────┘    └──────┬──────┘    └─────────────┘
                                             │
                                             ▼ (manual approval)
                                      ┌─────────────┐
                                      │   Deploy    │
                                      │   Prod      │
                                      └─────────────┘
```

### Pipeline CI/CD

#### Etapas del Pipeline

```yaml
# .github/workflows/deploy.yml
name: CI/CD Pipeline

stages:
  1. Build:
     - Checkout código
     - Instalar dependencias (pip, npm)
     - Build frontend (npm run build)
     - Build imagen Docker backend
  
  2. Test:
     - Ejecutar smoke tests
     - Validar build del frontend
     - Linting y formateo
  
  3. Deploy Staging:
     - Push imagen a registry
     - Deploy a staging (Railway/Render/Azure)
     - Ejecutar migraciones de BD
     - Health check
  
  4. Deploy Production:
     - Aprobación manual (opcional)
     - Deploy a producción
     - Ejecutar migraciones de BD
     - Health check
     - Notificación de éxito/fallo
```

#### Pasos Principales

| Paso | Descripción | Comando/Acción |
|------|-------------|----------------|
| **1. Checkout** | Obtener código fuente | `actions/checkout@v4` |
| **2. Setup Python** | Configurar Python 3.12 | `actions/setup-python@v5` |
| **3. Setup Node** | Configurar Node.js 18+ | `actions/setup-node@v4` |
| **4. Install Backend** | Instalar dependencias | `pip install -r requirements.txt` |
| **5. Install Frontend** | Instalar dependencias | `npm ci` |
| **6. Build Frontend** | Generar build de producción | `npm run build` |
| **7. Run Tests** | Ejecutar tests | `pytest tests/test_smoke.py` |
| **8. Build Docker** | Construir imagen | `docker build -t metabuilder-api .` |
| **9. Deploy** | Push y deploy al proveedor | Railway CLI / Render API / Azure CLI |
| **10. Migrate** | Ejecutar migraciones | `alembic upgrade head` |

### Versionado y Rollback

#### Estrategia de Versionado

| Tipo | Formato | Ejemplo | Uso |
|------|---------|---------|-----|
| **Semántico** | MAJOR.MINOR.PATCH | v1.2.3 | Releases oficiales |
| **Git Tags** | vX.Y.Z | v1.0.0 | Marcar releases |
| **Commit SHA** | 7 caracteres | abc1234 | Identificar builds |

#### Proceso de Rollback

```bash
# 1. Identificar versión anterior estable
git log --oneline -10

# 2. Opción A: Revertir en Railway/Render
# Usar dashboard del proveedor para rollback a deployment anterior

# 3. Opción B: Redeploy de versión anterior
git checkout v1.0.0
# Trigger manual del pipeline

# 4. Rollback de base de datos (si es necesario)
alembic downgrade -1  # Revertir última migración
```

#### Procedimiento de Emergencia

1. **Detectar** - Alertas de monitoreo o reporte de usuarios
2. **Evaluar** - Determinar severidad e impacto
3. **Decidir** - Rollback vs. hotfix
4. **Ejecutar** - Aplicar rollback desde dashboard del proveedor
5. **Verificar** - Health checks y validación manual
6. **Documentar** - Post-mortem y lecciones aprendidas

---

## Configuración

### Variables de Entorno

#### Backend (FastAPI)

| Variable | Descripción | Ejemplo | Requerida |
|----------|-------------|---------|-----------|
| `DATABASE_URL` | URL de conexión PostgreSQL | `postgresql://user:pass@host:5432/db` | ✅ |
| `SECRET_KEY` | Clave para firmar JWT | `your-256-bit-secret` | ✅ |
| `ALGORITHM` | Algoritmo JWT | `HS256` | ✅ |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Expiración del token | `30` | ❌ (default: 30) |
| `CORS_ORIGINS` | Orígenes permitidos | `https://app.example.com` | ✅ |
| `ENVIRONMENT` | Entorno actual | `production` | ❌ |
| `DEBUG` | Modo debug | `false` | ❌ (default: false) |

#### Frontend (React)

| Variable | Descripción | Ejemplo | Requerida |
|----------|-------------|---------|-----------|
| `VITE_API_URL` | URL base del backend | `https://api.example.com` | ✅ |
| `VITE_APP_NAME` | Nombre de la aplicación | `MetaBuilder` | ❌ |

#### Archivo `.env.example`

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/metabuilder

# JWT Configuration
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Environment
ENVIRONMENT=development
DEBUG=true

# Frontend
VITE_API_URL=http://localhost:8000/api
```

### Secretos y Manejo de Credenciales

#### Principios de Seguridad

| Principio | Implementación |
|-----------|----------------|
| **Nunca en código** | Secretos solo en variables de entorno |
| **Rotación** | Cambiar credenciales periódicamente |
| **Mínimo privilegio** | Solo permisos necesarios por servicio |
| **Cifrado en reposo** | Usar gestores de secretos del proveedor |
| **Auditoría** | Registrar accesos a secretos |

#### Gestión por Proveedor

| Proveedor | Servicio de Secretos | Configuración |
|-----------|---------------------|---------------|
| **Railway** | Variables de entorno en dashboard | Cifradas automáticamente |
| **Render** | Environment Groups | Compartibles entre servicios |
| **Azure** | Azure Key Vault | Integración con App Service |

#### Secretos Críticos

```
⚠️ NUNCA COMMITEAR:
- DATABASE_URL (contiene credenciales)
- SECRET_KEY (clave de cifrado JWT)
- Archivos .env con valores reales
- Credenciales de proveedores cloud
```

---

## Escalabilidad y Monitoreo

### Estrategias de Escalado

#### Escalado Horizontal

```
                    ┌─────────────────┐
                    │  Load Balancer  │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
   ┌───────────┐       ┌───────────┐       ┌───────────┐
   │  API #1   │       │  API #2   │       │  API #N   │
   │ (FastAPI) │       │ (FastAPI) │       │ (FastAPI) │
   └───────────┘       └───────────┘       └───────────┘
```

| Componente | Estrategia | Trigger |
|------------|------------|---------|
| **Backend** | Réplicas horizontales | CPU > 70%, Requests/s |
| **Base de datos** | Escalado vertical + Read replicas | Conexiones, CPU |
| **Frontend** | CDN con caché | Automático |

#### Configuración por Proveedor

| Proveedor | Escalado Backend | Escalado BD |
|-----------|------------------|-------------|
| **Railway** | Manual (plan Team) | Vertical automático |
| **Render** | Auto-scaling disponible | Vertical manual |
| **Azure** | Auto-scale rules | Flexible Server auto-grow |

### Logs

#### Estrategia de Logging

| Nivel | Uso | Ejemplo |
|-------|-----|---------|
| **ERROR** | Fallos que requieren atención | Excepciones no manejadas |
| **WARNING** | Situaciones anómalas | Validación fallida |
| **INFO** | Eventos operacionales | Request completado |
| **DEBUG** | Información de desarrollo | Queries SQL (solo dev) |

#### Configuración de Logs

```python
# Formato estructurado para producción
{
    "timestamp": "2026-01-24T10:30:00Z",
    "level": "INFO",
    "message": "Request processed",
    "request_id": "abc-123",
    "method": "POST",
    "path": "/api/entities/123/records",
    "status_code": 201,
    "duration_ms": 45
}
```

#### Acceso a Logs por Proveedor

| Proveedor | Herramienta | Retención |
|-----------|-------------|-----------|
| **Railway** | Dashboard logs | 7 días |
| **Render** | Log streams | 7 días (free) |
| **Azure** | Log Analytics | Configurable |

### Métricas

#### Métricas Clave (KPIs)

| Métrica | Descripción | Umbral Alerta |
|---------|-------------|---------------|
| **Response Time (P95)** | Latencia del 95% de requests | > 500ms |
| **Error Rate** | % de requests con error | > 1% |
| **Uptime** | Disponibilidad del servicio | < 99.5% |
| **CPU Usage** | Uso de CPU del contenedor | > 80% |
| **Memory Usage** | Uso de memoria | > 85% |
| **DB Connections** | Conexiones activas a PostgreSQL | > 80% del pool |

#### Endpoints de Health Check

```
GET /health          → Estado general del servicio
GET /health/ready    → Listo para recibir tráfico
GET /health/live     → El proceso está vivo
```

### Alertas

#### Configuración de Alertas

| Severidad | Condición | Acción |
|-----------|-----------|--------|
| **Crítica** | Servicio caído, Error rate > 5% | Notificación inmediata |
| **Alta** | Response time > 1s, CPU > 90% | Notificación en 5 min |
| **Media** | Error rate > 1%, Memory > 80% | Notificación en 15 min |
| **Baja** | Warnings en logs | Revisión diaria |

#### Canales de Notificación

| Canal | Uso |
|-------|-----|
| **Email** | Alertas de todas las severidades |
| **Slack/Discord** | Alertas críticas y altas |
| **Dashboard** | Visualización en tiempo real |

---

## Suposiciones

Las siguientes inferencias se realizaron debido a que `funcionalidad_core.md` no especifica estos aspectos de manera explícita:

### Infraestructura

1. **Load Balancer**: Se asume el uso del load balancer nativo del proveedor cloud seleccionado (Railway, Render o Azure).

2. **CDN**: Para el frontend en producción, se asume el uso de CDN integrado del proveedor o servicios como Cloudflare para optimizar la entrega de assets estáticos.

3. **SSL/TLS**: Se asume que los certificados HTTPS son gestionados automáticamente por el proveedor cloud (Let's Encrypt o similar).

### Escalabilidad

4. **Escalado Automático**: Dado que es un MVP con alcance de 30 horas, se asume escalado manual inicial con posibilidad de configurar auto-scaling según el proveedor.

5. **Pool de Conexiones**: Se asume un pool de conexiones de base de datos con máximo de 10-20 conexiones para el MVP, ajustable según demanda.

6. **Caché**: No se incluye capa de caché (Redis) en el MVP, pero la arquitectura permite agregarlo posteriormente.

### Monitoreo

7. **Herramientas de Monitoreo**: Se asume el uso de las herramientas nativas del proveedor cloud para monitoreo inicial. Para monitoreo avanzado, se podría integrar:
   - Sentry para tracking de errores
   - Prometheus + Grafana para métricas
   - ELK Stack para logs centralizados

8. **Backups**: Se asume backup automático diario de la base de datos proporcionado por el servicio de PostgreSQL gestionado del proveedor.

### Seguridad

9. **WAF (Web Application Firewall)**: No incluido en el MVP, pero recomendado para producción con tráfico significativo.

10. **Rate Limiting**: Se asume implementación básica a nivel de aplicación o mediante el proveedor cloud.

### CI/CD

11. **Aprobación Manual para Producción**: Se asume que el deploy a producción requiere aprobación manual como medida de seguridad.

12. **Tests de Integración**: El MVP incluye solo smoke tests; se asume expansión de cobertura de tests según evolucione el proyecto.

---

## Referencias

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Railway Docs](https://docs.railway.app/)
- [Render Docs](https://render.com/docs)
- [Azure App Service Docs](https://docs.microsoft.com/azure/app-service/)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions](https://docs.github.com/actions)

---

**Última actualización:** Enero 2026

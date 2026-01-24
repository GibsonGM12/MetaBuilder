# Seguridad

## Índice

1. [Principios de Seguridad](#1-principios-de-seguridad)
2. [Autenticación y Autorización](#2-autenticación-y-autorización)
3. [Protección de Datos](#3-protección-de-datos)
4. [Seguridad de la Aplicación](#4-seguridad-de-la-aplicación)
5. [Infraestructura y Red](#5-infraestructura-y-red)
6. [Auditoría y Monitoreo](#6-auditoría-y-monitoreo)
7. [Suposiciones](#7-suposiciones)

---

## 1. Principios de Seguridad

MetaBuilder adopta los siguientes principios fundamentales de seguridad para garantizar la protección del sistema y sus datos:

### 1.1 Principio de Mínimo Privilegio (Least Privilege)

- Los usuarios solo tienen acceso a las funcionalidades estrictamente necesarias para realizar sus tareas.
- El rol **User** únicamente puede realizar operaciones CRUD sobre registros de datos.
- El rol **Admin** tiene permisos adicionales para gestionar metadatos (entidades y campos).
- Las conexiones a la base de datos utilizan credenciales con permisos limitados según el entorno.

### 1.2 Defensa en Profundidad (Defense in Depth)

El sistema implementa múltiples capas de seguridad:

```
┌─────────────────────────────────────────────────────────────┐
│  Capa 1: Frontend                                           │
│  - Validación de entrada del lado del cliente               │
│  - Sanitización de datos en formularios                     │
│  - Manejo seguro de tokens                                  │
├─────────────────────────────────────────────────────────────┤
│  Capa 2: API Layer                                          │
│  - Middleware de autenticación JWT                          │
│  - Verificación de roles y permisos                         │
│  - Validación de entrada con Pydantic                       │
├─────────────────────────────────────────────────────────────┤
│  Capa 3: Application Layer                                  │
│  - Validación de lógica de negocio                          │
│  - Sanitización de datos dinámicos                          │
│  - Control de acceso por entidad                            │
├─────────────────────────────────────────────────────────────┤
│  Capa 4: Infrastructure Layer                               │
│  - Queries parametrizadas (prevención SQL injection)        │
│  - Hashing seguro de contraseñas (bcrypt)                   │
│  - Conexiones seguras a base de datos                       │
├─────────────────────────────────────────────────────────────┤
│  Capa 5: Base de Datos                                      │
│  - Acceso restringido por credenciales                      │
│  - Esquema separado para metadatos y datos dinámicos        │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 Seguridad por Diseño (Security by Design)

- La arquitectura Clean Architecture facilita la separación de responsabilidades de seguridad.
- Los secretos se gestionan mediante variables de entorno, nunca en código fuente.
- Las dependencias se seleccionan considerando su historial de seguridad (FastAPI, SQLAlchemy, bcrypt).

### 1.4 Principio de Fail-Safe

- Ante cualquier error de autenticación o autorización, el sistema deniega el acceso por defecto.
- Los errores no exponen información sensible al cliente (mensajes genéricos en producción).
- Las sesiones expiran automáticamente después de 24 horas.

---

## 2. Autenticación y Autorización

### 2.1 Mecanismos de Autenticación

#### 2.1.1 Sistema de Autenticación JWT

MetaBuilder utiliza **JSON Web Tokens (JWT)** para la autenticación de usuarios.

**Flujo de Autenticación:**

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Cliente    │      │   Backend    │      │  AuthService │      │   Database   │
│  (Frontend)  │      │    (API)     │      │              │      │              │
└──────┬───────┘      └──────┬───────┘      └──────┬───────┘      └──────┬───────┘
       │                     │                     │                     │
       │ POST /api/auth/login│                     │                     │
       │ {username, password}│                     │                     │
       │────────────────────>│                     │                     │
       │                     │ authenticate()      │                     │
       │                     │────────────────────>│                     │
       │                     │                     │  SELECT user        │
       │                     │                     │────────────────────>│
       │                     │                     │<────────────────────│
       │                     │                     │  user_data          │
       │                     │                     │                     │
       │                     │                     │  bcrypt.verify()    │
       │                     │                     │  (password hash)    │
       │                     │                     │                     │
       │                     │                     │  generate_jwt()     │
       │                     │<────────────────────│                     │
       │                     │  JWT Token          │                     │
       │<────────────────────│                     │                     │
       │ {token, user_info}  │                     │                     │
       │                     │                     │                     │
```

**Configuración JWT:**

| Parámetro | Valor | Descripción |
|-----------|-------|-------------|
| Algoritmo | HS256 | HMAC con SHA-256 |
| Expiración | 24 horas | Tiempo de vida del token |
| Secreto | JWT_SECRET_KEY | Variable de entorno |

**Estructura del Token JWT:**

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "user_id": "uuid",
    "username": "string",
    "role": "Admin | User",
    "exp": "timestamp",
    "iat": "timestamp"
  },
  "signature": "HMACSHA256(...)"
}
```

#### 2.1.2 Gestión de Contraseñas

| Aspecto | Implementación |
|---------|----------------|
| **Algoritmo de hash** | bcrypt |
| **Salt** | Generado automáticamente por bcrypt |
| **Work factor** | 12 rounds (por defecto) |
| **Almacenamiento** | Solo hash en columna `password_hash` |

**Requisitos de contraseña recomendados:**

- Longitud mínima: 8 caracteres
- Combinación de letras, números y caracteres especiales
- No se almacenan contraseñas en texto plano

#### 2.1.3 Endpoints de Autenticación

| Endpoint | Método | Descripción | Autenticación |
|----------|--------|-------------|---------------|
| `/api/auth/register` | POST | Registro de nuevo usuario | No requerida |
| `/api/auth/login` | POST | Inicio de sesión | No requerida |

### 2.2 Gestión de Roles y Permisos

#### 2.2.1 Matriz de Roles

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **Admin** | Administrador del sistema | Gestión completa de metadatos + CRUD de datos |
| **User** | Usuario estándar | Solo CRUD de registros de datos |

#### 2.2.2 Control de Acceso por Endpoint

| Recurso | Endpoint | Admin | User |
|---------|----------|-------|------|
| **Entidades** | GET /api/metadata/entities | ✅ | ❌ |
| **Entidades** | POST /api/metadata/entities | ✅ | ❌ |
| **Entidades** | PUT /api/metadata/entities/{id} | ✅ | ❌ |
| **Entidades** | DELETE /api/metadata/entities/{id} | ✅ | ❌ |
| **Campos** | POST /api/metadata/entities/{id}/fields | ✅ | ❌ |
| **Campos** | DELETE /api/metadata/entities/{id}/fields/{fieldId} | ✅ | ❌ |
| **Registros** | GET /api/entities/{id}/records | ✅ | ✅ |
| **Registros** | POST /api/entities/{id}/records | ✅ | ✅ |
| **Registros** | PUT /api/entities/{id}/records/{recordId} | ✅ | ✅ |
| **Registros** | DELETE /api/entities/{id}/records/{recordId} | ✅ | ✅ |

#### 2.2.3 Implementación del Middleware de Autorización

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Request    │      │  JWT         │      │  Role        │      │   Endpoint   │
│   con Token  │─────>│  Middleware  │─────>│  Validator   │─────>│   Handler    │
└──────────────┘      └──────────────┘      └──────────────┘      └──────────────┘
                             │                     │
                             │ Token inválido      │ Rol insuficiente
                             ▼                     ▼
                      ┌──────────────┐      ┌──────────────┐
                      │  401         │      │  403         │
                      │  Unauthorized│      │  Forbidden   │
                      └──────────────┘      └──────────────┘
```

---

## 3. Protección de Datos

### 3.1 Datos en Tránsito

#### 3.1.1 Cifrado de Comunicaciones

| Capa | Protocolo | Descripción |
|------|-----------|-------------|
| Frontend ↔ Backend | HTTPS/TLS 1.2+ | Cifrado de todas las comunicaciones API |
| Backend ↔ Database | SSL/TLS | Conexión cifrada a PostgreSQL |

**Configuración HTTPS en Producción:**

- Certificados SSL gestionados por el proveedor de hosting (Railway/Render)
- Redirección automática de HTTP a HTTPS
- Headers de seguridad HSTS (HTTP Strict Transport Security)

#### 3.1.2 Configuración CORS

```python
# Configuración de CORS en producción
CORS_ORIGINS = [
    "https://metabuilder.vercel.app"  # Solo dominios autorizados
]

# Configuración de CORS en desarrollo
CORS_ORIGINS = [
    "http://localhost:5173"
]
```

### 3.2 Datos en Reposo

#### 3.2.1 Base de Datos PostgreSQL

| Aspecto | Implementación |
|---------|----------------|
| **Contraseñas** | Almacenadas como hash bcrypt |
| **Credenciales DB** | Variables de entorno cifradas |
| **Backups** | Gestionados por proveedor cloud |

#### 3.2.2 Almacenamiento de Tokens en Cliente

| Mecanismo | Ubicación | Consideraciones |
|-----------|-----------|-----------------|
| JWT Token | localStorage | Vulnerable a XSS - mitigado con CSP |

**Recomendación para producción:**
- Considerar migración a cookies HttpOnly para mayor seguridad
- Implementar Content Security Policy (CSP)

### 3.3 Manejo de Información Sensible

#### 3.3.1 Clasificación de Datos Sensibles

| Dato | Clasificación | Protección |
|------|---------------|------------|
| Contraseñas | Alta | Hash bcrypt, nunca en logs |
| JWT_SECRET_KEY | Crítica | Variable de entorno, rotación periódica |
| DATABASE_URL | Alta | Variable de entorno |
| Tokens JWT | Alta | Expiración automática, validación en cada request |
| Datos de usuario | Media | Acceso controlado por autenticación |

#### 3.3.2 Gestión de Secretos

```
┌─────────────────────────────────────────────────────────────┐
│                    GESTIÓN DE SECRETOS                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────┐     ┌─────────────────┐               │
│  │  Development    │     │   Production    │               │
│  │  (.env.local)   │     │ (Railway/Render)│               │
│  └────────┬────────┘     └────────┬────────┘               │
│           │                       │                         │
│           ▼                       ▼                         │
│  ┌─────────────────┐     ┌─────────────────┐               │
│  │ JWT_SECRET_KEY  │     │ JWT_SECRET_KEY  │               │
│  │ = dev-secret    │     │ = <secret-prod> │               │
│  └─────────────────┘     └─────────────────┘               │
│                                                              │
│  ┌─────────────────┐     ┌─────────────────┐               │
│  │ DATABASE_URL    │     │ DATABASE_URL    │               │
│  │ = localhost     │     │ = <encrypted>   │               │
│  └─────────────────┘     └─────────────────┘               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Buenas prácticas implementadas:**

- Archivos `.env` excluidos del repositorio (.gitignore)
- Archivo `.env.example` con variables sin valores sensibles
- Secretos de producción gestionados en plataforma de hosting
- Diferentes secretos por entorno (desarrollo vs producción)

---

## 4. Seguridad de la Aplicación

### 4.1 Validación de Entradas

#### 4.1.1 Validación con Pydantic

Todas las entradas de la API se validan mediante modelos Pydantic:

```python
# Ejemplo de validación de entrada
class CreateEntityDTO(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, regex="^[a-zA-Z_][a-zA-Z0-9_]*$")
    display_name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
```

#### 4.1.2 Capas de Validación

| Capa | Tipo de Validación | Herramienta |
|------|-------------------|-------------|
| Frontend | Formato y requeridos | React Hook Form / validación manual |
| API | Tipos y restricciones | Pydantic |
| Application | Lógica de negocio | Servicios personalizados |
| Infrastructure | Integridad de datos | PostgreSQL constraints |

#### 4.1.3 Validación Dinámica de Datos

Para entidades definidas por el usuario:

```
┌──────────────────────────────────────────────────────────────┐
│              VALIDACIÓN DE DATOS DINÁMICOS                    │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Obtener metadatos de la entidad                          │
│     └─> Campos, tipos, restricciones                         │
│                                                               │
│  2. Validar cada campo del payload                           │
│     ├─> Tipo de dato (TEXT, NUMBER, INTEGER, DATE, BOOLEAN)  │
│     ├─> Campo requerido (is_required)                        │
│     └─> Longitud máxima (max_length para TEXT)               │
│                                                               │
│  3. Rechazar campos no definidos en metadatos                │
│                                                               │
│  4. Sanitizar valores antes de query                         │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### 4.2 Manejo de Errores

#### 4.2.1 Estrategia de Manejo de Errores

| Entorno | Comportamiento |
|---------|----------------|
| **Desarrollo** | Errores detallados con stack trace |
| **Producción** | Mensajes genéricos, detalles en logs |

#### 4.2.2 Códigos de Error HTTP

| Código | Significado | Uso |
|--------|-------------|-----|
| 400 | Bad Request | Validación fallida |
| 401 | Unauthorized | Token inválido o ausente |
| 403 | Forbidden | Permisos insuficientes |
| 404 | Not Found | Recurso no encontrado |
| 422 | Unprocessable Entity | Error de validación Pydantic |
| 500 | Internal Server Error | Error del servidor |

#### 4.2.3 Formato de Respuesta de Error

```json
{
  "detail": "Mensaje descriptivo del error",
  "error_code": "ENTITY_NOT_FOUND",
  "timestamp": "2026-01-24T10:30:00Z"
}
```

### 4.3 Protección contra Amenazas Comunes (OWASP Top 10)

#### 4.3.1 A01:2021 - Broken Access Control

| Amenaza | Mitigación |
|---------|------------|
| Acceso no autorizado a endpoints | Middleware JWT en todas las rutas protegidas |
| Escalación de privilegios | Validación de rol en cada operación sensible |
| IDOR (Insecure Direct Object Reference) | Validación de ownership donde aplique |

#### 4.3.2 A02:2021 - Cryptographic Failures

| Amenaza | Mitigación |
|---------|------------|
| Contraseñas débiles | Hash bcrypt con salt |
| Transmisión insegura | HTTPS obligatorio en producción |
| Secretos expuestos | Variables de entorno, no en código |

#### 4.3.3 A03:2021 - Injection

| Amenaza | Mitigación |
|---------|------------|
| SQL Injection | Queries parametrizadas con SQLAlchemy |
| Command Injection | No ejecución de comandos del sistema |

**Prevención de SQL Injection:**

```python
# ✅ CORRECTO: Uso de parámetros
query = text("SELECT * FROM :table WHERE id = :id")
result = conn.execute(query, {"table": table_name, "id": record_id})

# ❌ INCORRECTO: Concatenación de strings
query = f"SELECT * FROM {table_name} WHERE id = '{record_id}'"
```

#### 4.3.4 A04:2021 - Insecure Design

| Amenaza | Mitigación |
|---------|------------|
| Diseño inseguro | Clean Architecture con separación de responsabilidades |
| Falta de validación | Múltiples capas de validación |

#### 4.3.5 A05:2021 - Security Misconfiguration

| Amenaza | Mitigación |
|---------|------------|
| CORS permisivo | Lista blanca de orígenes permitidos |
| Debug en producción | Variable ENVIRONMENT para controlar |
| Headers inseguros | Configuración de headers de seguridad |

#### 4.3.6 A06:2021 - Vulnerable and Outdated Components

| Amenaza | Mitigación |
|---------|------------|
| Dependencias vulnerables | Versionado explícito en requirements.txt |
| Componentes obsoletos | Actualización periódica de dependencias |

**Dependencias principales auditadas:**

- FastAPI (framework web seguro)
- SQLAlchemy (ORM con prevención de injection)
- PyJWT (manejo seguro de tokens)
- bcrypt (hashing de contraseñas)
- Pydantic (validación de datos)

#### 4.3.7 A07:2021 - Identification and Authentication Failures

| Amenaza | Mitigación |
|---------|------------|
| Credenciales débiles | Requisitos de contraseña |
| Sesiones largas | Expiración de tokens (24h) |
| Brute force | Rate limiting (recomendado para producción) |

#### 4.3.8 A08:2021 - Software and Data Integrity Failures

| Amenaza | Mitigación |
|---------|------------|
| Código no verificado | CI/CD con GitHub Actions |
| Datos corruptos | Validación en múltiples capas |

#### 4.3.9 A09:2021 - Security Logging and Monitoring Failures

| Amenaza | Mitigación |
|---------|------------|
| Falta de logs | Logging estructurado |
| Sin monitoreo | Logs en stdout para servicios cloud |

#### 4.3.10 A10:2021 - Server-Side Request Forgery (SSRF)

| Amenaza | Mitigación |
|---------|------------|
| SSRF | No se realizan requests a URLs proporcionadas por usuario |

---

## 5. Infraestructura y Red

### 5.1 Arquitectura de Red

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ARQUITECTURA DE RED                               │
│                                                                          │
│  ┌──────────────┐                                                       │
│  │   Internet   │                                                       │
│  └──────┬───────┘                                                       │
│         │ HTTPS (443)                                                   │
│         ▼                                                                │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │                    CDN / Load Balancer                        │      │
│  │                  (Railway / Render / Vercel)                  │      │
│  └─────────┬──────────────────────────────┬─────────────────────┘      │
│            │                              │                             │
│            ▼                              ▼                             │
│  ┌──────────────────┐          ┌──────────────────┐                    │
│  │    Frontend      │          │     Backend      │                    │
│  │   (Static SPA)   │          │    (FastAPI)     │                    │
│  │   Port: 443      │          │   Port: 8000     │                    │
│  └──────────────────┘          └────────┬─────────┘                    │
│                                         │                               │
│                                         │ SSL/TLS (5432)               │
│                                         ▼                               │
│                                ┌──────────────────┐                    │
│                                │   PostgreSQL     │                    │
│                                │   (Managed)      │                    │
│                                │   Port: 5432     │                    │
│                                └──────────────────┘                    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Controles de Seguridad de Red

| Control | Implementación |
|---------|----------------|
| **Firewall** | Gestionado por proveedor cloud |
| **DDoS Protection** | Incluido en Railway/Render |
| **SSL Termination** | En load balancer |
| **Network Isolation** | Base de datos no expuesta públicamente |

### 5.3 Seguridad de Contenedores (Docker)

| Aspecto | Configuración |
|---------|---------------|
| **Base image** | Imágenes oficiales (python:3.12-slim, postgres:15-alpine) |
| **Usuario** | Evitar root cuando sea posible |
| **Secretos** | Variables de entorno, no en Dockerfile |
| **Puertos** | Solo exponer puertos necesarios |

### 5.4 Headers de Seguridad HTTP

```python
# Headers recomendados para producción
security_headers = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Content-Security-Policy": "default-src 'self'"
}
```

---

## 6. Auditoría y Monitoreo

### 6.1 Logs de Seguridad

#### 6.1.1 Eventos Registrados

| Evento | Nivel | Información Registrada |
|--------|-------|------------------------|
| Login exitoso | INFO | user_id, username, timestamp, IP |
| Login fallido | WARNING | username intentado, timestamp, IP |
| Token inválido | WARNING | timestamp, IP, motivo |
| Acceso denegado (403) | WARNING | user_id, recurso, timestamp |
| Error de servidor | ERROR | stack trace (solo en desarrollo) |
| Creación de entidad | INFO | admin_id, entity_name, timestamp |
| Eliminación de datos | INFO | user_id, entity_id, record_id, timestamp |

#### 6.1.2 Formato de Logs

```
[TIMESTAMP] [LEVEL] [MODULE] [REQUEST_ID] - MESSAGE
```

**Ejemplo:**
```
2026-01-24 10:30:00 INFO api.auth [req-abc123] - User 'admin' logged in successfully from 192.168.1.1
2026-01-24 10:31:00 WARNING api.auth [req-def456] - Failed login attempt for user 'unknown' from 192.168.1.2
2026-01-24 10:32:00 WARNING api.middleware [req-ghi789] - Access denied: User 'user1' attempted to access /api/metadata/entities
```

#### 6.1.3 Almacenamiento de Logs

| Entorno | Destino | Retención |
|---------|---------|-----------|
| Desarrollo | stdout/stderr | Sesión actual |
| Producción | Servicio de logs del proveedor | Según plan |

### 6.2 Detección de Incidentes

#### 6.2.1 Indicadores de Compromiso (IoC)

| Indicador | Acción Recomendada |
|-----------|-------------------|
| Múltiples logins fallidos | Alertar, considerar bloqueo temporal |
| Tokens con formato inválido | Registrar IP, monitorear patrón |
| Accesos a rutas no existentes | Posible escaneo, monitorear |
| Picos de errores 500 | Investigar inmediatamente |

#### 6.2.2 Proceso de Respuesta a Incidentes

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Detección   │────>│   Análisis   │────>│  Contención  │────>│ Recuperación │
│              │     │              │     │              │     │              │
│ - Logs       │     │ - Evaluar    │     │ - Revocar    │     │ - Restaurar  │
│ - Alertas    │     │   impacto    │     │   tokens     │     │   servicio   │
│ - Monitoreo  │     │ - Identificar│     │ - Bloquear   │     │ - Documentar │
│              │     │   causa raíz │     │   acceso     │     │   lecciones  │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

### 6.3 Métricas de Seguridad

| Métrica | Descripción | Umbral de Alerta |
|---------|-------------|------------------|
| failed_login_count | Intentos de login fallidos por minuto | > 10 |
| invalid_token_count | Tokens inválidos por minuto | > 20 |
| unauthorized_access_count | Accesos denegados (403) por minuto | > 5 |
| error_rate_5xx | Porcentaje de errores 500 | > 1% |

---

## 7. Suposiciones

Las siguientes suposiciones se han realizado para completar esta documentación de seguridad, ya que no estaban explícitamente definidas en la funcionalidad core del proyecto:

### 7.1 Suposiciones sobre Autenticación

| Aspecto | Suposición | Justificación |
|---------|------------|---------------|
| **Refresh Tokens** | No implementados en MVP | Simplificación para proyecto de 30 horas |
| **Bloqueo de cuenta** | No implementado | No mencionado en funcionalidad core |
| **Recuperación de contraseña** | No implementada | No incluida en scope |
| **MFA** | No implementado | Fuera de scope del MVP |

### 7.2 Suposiciones sobre Cifrado

| Aspecto | Suposición | Justificación |
|---------|------------|---------------|
| **Cifrado en reposo de BD** | Gestionado por proveedor cloud | Railway/Render manejan cifrado de storage |
| **Rotación de JWT_SECRET_KEY** | Manual | No hay sistema automatizado |
| **Cifrado de campos sensibles** | No implementado | No requerido en MVP |

### 7.3 Suposiciones sobre Infraestructura

| Aspecto | Suposición | Justificación |
|---------|------------|---------------|
| **WAF** | Proporcionado por hosting | Railway/Render incluyen protección básica |
| **Rate Limiting** | No implementado en MVP | Recomendado para producción |
| **IP Whitelisting** | No implementado | Acceso público a la aplicación |
| **VPN/VPC** | No requerido | Arquitectura serverless simplificada |

### 7.4 Suposiciones sobre Auditoría

| Aspecto | Suposición | Justificación |
|---------|------------|---------------|
| **Auditoría completa** | No implementada | Explícitamente fuera de scope en MVP |
| **Retención de logs** | Según proveedor | No hay requisito específico |
| **SIEM** | No integrado | Fuera de scope del MVP |

### 7.5 Recomendaciones para Producción

Se recomienda implementar las siguientes mejoras antes de un despliegue en producción con datos reales:

1. **Rate Limiting**: Implementar límites de requests por IP/usuario
2. **Refresh Tokens**: Añadir sistema de refresh tokens para mejor UX
3. **Cookies HttpOnly**: Migrar almacenamiento de token de localStorage a cookies
4. **Auditoría**: Implementar sistema completo de auditoría de acciones
5. **Backups automatizados**: Configurar backups regulares de base de datos
6. **Pruebas de penetración**: Realizar pentest antes de producción
7. **Política de contraseñas**: Implementar validación de fortaleza de contraseñas
8. **Alertas automatizadas**: Configurar alertas para eventos de seguridad críticos

---

*Última actualización: Enero 2026*

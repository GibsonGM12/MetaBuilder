# Descripción General del Producto - MetaBuilder

## 1. Resumen Ejecutivo

**MetaBuilder** es una plataforma administrativa low-code basada en metadatos que permite a los administradores definir entidades de negocio (estructuras de datos) de forma dinámica mediante una interfaz visual, sin necesidad de escribir código. El sistema genera automáticamente tablas en PostgreSQL, APIs RESTful y interfaces de usuario para la gestión de datos.

La plataforma está diseñada para organizaciones que necesitan crear aplicaciones de gestión de datos rápidamente, reduciendo significativamente los tiempos y costos de desarrollo tradicional. Con MetaBuilder, lo que normalmente tomaría días o semanas de desarrollo puede lograrse en minutos.

---

## 2. Propuesta de Valor

### Para Administradores de Sistemas
- **Autonomía**: Crear estructuras de datos sin depender de desarrolladores
- **Velocidad**: De idea a implementación en minutos, no días
- **Flexibilidad**: Modificar estructuras sin downtime ni deploys

### Para Usuarios de Negocio
- **Acceso inmediato**: Interfaces listas para usar al momento de crear la entidad
- **Consistencia**: Formularios y validaciones automáticas
- **Productividad**: Enfoque en los datos, no en la herramienta

### Para la Organización
- **Reducción de costos**: Menos horas de desarrollo
- **Time-to-market**: Implementaciones más rápidas
- **Escalabilidad**: Arquitectura preparada para crecer

---

## 3. Casos de Uso Principales

### CU-01: Administrador crea una nueva entidad

**Actor**: Administrador  
**Precondición**: Usuario autenticado con rol Admin  
**Flujo principal**:
1. Admin accede al módulo de administración de entidades
2. Hace clic en "Nueva Entidad"
3. Ingresa nombre (ej: "productos"), nombre para mostrar (ej: "Productos"), y descripción
4. El sistema valida que el nombre sea único
5. El sistema crea la entidad en metadatos
6. El sistema genera la tabla física `entity_{uuid}` en PostgreSQL
7. Admin es redirigido a la pantalla de gestión de campos

**Postcondición**: Entidad creada y tabla física existente

---

### CU-02: Administrador agrega campos a una entidad

**Actor**: Administrador  
**Precondición**: Entidad existente  
**Flujo principal**:
1. Admin selecciona una entidad existente
2. Hace clic en "Agregar Campo"
3. Ingresa: nombre del campo, nombre para mostrar, tipo de dato, si es requerido
4. Si el tipo es TEXT, puede especificar longitud máxima
5. El sistema valida que el nombre sea único dentro de la entidad
6. El sistema guarda el campo en metadatos
7. El sistema ejecuta `ALTER TABLE` para agregar la columna
8. El campo aparece en la lista de campos de la entidad

**Postcondición**: Campo creado en metadatos y columna agregada a la tabla

---

### CU-03: Usuario crea un registro de datos

**Actor**: Usuario (Admin o User)  
**Precondición**: Entidad con al menos un campo definido  
**Flujo principal**:
1. Usuario selecciona una entidad del menú
2. Ve el listado de registros existentes (vacío inicialmente)
3. Hace clic en "Nuevo Registro"
4. El sistema genera un formulario dinámico según los campos de la entidad
5. Usuario completa los campos
6. El sistema valida campos requeridos y tipos de datos
7. El sistema inserta el registro en la tabla dinámica
8. Usuario ve el registro en el listado

**Postcondición**: Registro creado en la tabla dinámica

---

### CU-04: Usuario edita un registro existente

**Actor**: Usuario (Admin o User)  
**Precondición**: Registro existente  
**Flujo principal**:
1. Usuario ve el listado de registros
2. Hace clic en "Editar" en un registro específico
3. El sistema carga los datos actuales en el formulario dinámico
4. Usuario modifica los campos deseados
5. El sistema valida los cambios
6. El sistema actualiza el registro
7. Usuario ve los cambios reflejados en el listado

**Postcondición**: Registro actualizado

---

### CU-05: Usuario elimina un registro

**Actor**: Usuario (Admin o User)  
**Precondición**: Registro existente  
**Flujo principal**:
1. Usuario ve el listado de registros
2. Hace clic en "Eliminar" en un registro específico
3. El sistema muestra confirmación
4. Usuario confirma la eliminación
5. El sistema elimina el registro (hard delete)
6. El registro desaparece del listado

**Postcondición**: Registro eliminado permanentemente

---

## 4. Flujos Principales (Alto Nivel)

### Flujo de Autenticación

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Usuario │────▶│  Login   │────▶│  Validar │────▶│  Generar │
│          │     │  Form    │     │  Creds   │     │  JWT     │
└──────────┘     └──────────┘     └──────────┘     └────┬─────┘
                                                        │
                                                        ▼
                                                  ┌──────────┐
                                                  │  Guardar │
                                                  │  Token   │
                                                  │  Local   │
                                                  └────┬─────┘
                                                        │
                                                        ▼
                                                  ┌──────────┐
                                                  │ Redirigir│
                                                  │ Dashboard│
                                                  └──────────┘
```

### Flujo de Creación de Entidad

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Admin   │────▶│  Form    │────▶│  Validar │────▶│  Guardar │
│          │     │  Entidad │     │  Nombre  │     │ Metadatos│
└──────────┘     └──────────┘     └──────────┘     └────┬─────┘
                                                        │
                                                        ▼
                                                  ┌──────────┐
                                                  │  Crear   │
                                                  │  Tabla   │
                                                  │  Física  │
                                                  └────┬─────┘
                                                        │
                                                        ▼
                                                  ┌──────────┐
                                                  │ Gestionar│
                                                  │  Campos  │
                                                  └──────────┘
```

### Flujo de CRUD Dinámico

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Usuario  │────▶│ Seleccio-│────▶│  Cargar  │────▶│  Mostrar │
│          │     │nar Entid.│     │ Metadatos│     │  Listado │
└──────────┘     └──────────┘     └──────────┘     └────┬─────┘
                                                        │
                      ┌─────────────────────────────────┼─────────────────────────────────┐
                      │                                 │                                 │
                      ▼                                 ▼                                 ▼
                ┌──────────┐                     ┌──────────┐                      ┌──────────┐
                │  Crear   │                     │  Editar  │                      │ Eliminar │
                │  Nuevo   │                     │ Existente│                      │ Registro │
                └────┬─────┘                     └────┬─────┘                      └────┬─────┘
                     │                                │                                 │
                     ▼                                ▼                                 ▼
                ┌──────────┐                     ┌──────────┐                      ┌──────────┐
                │ Formulario                     │ Formulario                      │ Confirmar│
                │ Dinámico │                     │ con Datos │                      │  Modal   │
                └────┬─────┘                     └────┬─────┘                      └────┬─────┘
                     │                                │                                 │
                     ▼                                ▼                                 ▼
                ┌──────────┐                     ┌──────────┐                      ┌──────────┐
                │  INSERT  │                     │  UPDATE  │                      │  DELETE  │
                │  en BD   │                     │  en BD   │                      │  en BD   │
                └──────────┘                     └──────────┘                      └──────────┘
```

---

## 5. Roles y Permisos

### Matriz de Permisos

| Funcionalidad | Admin | User |
|---------------|:-----:|:----:|
| **Autenticación** | | |
| Registrarse | ✅ | ✅ |
| Iniciar sesión | ✅ | ✅ |
| Cerrar sesión | ✅ | ✅ |
| **Gestión de Metadatos** | | |
| Ver entidades | ✅ | ❌ |
| Crear entidad | ✅ | ❌ |
| Editar entidad | ✅ | ❌ |
| Eliminar entidad | ✅ | ❌ |
| Ver campos | ✅ | ❌ |
| Agregar campo | ✅ | ❌ |
| Eliminar campo | ✅ | ❌ |
| **CRUD de Datos** | | |
| Ver listado de registros | ✅ | ✅ |
| Ver detalle de registro | ✅ | ✅ |
| Crear registro | ✅ | ✅ |
| Editar registro | ✅ | ✅ |
| Eliminar registro | ✅ | ✅ |

### Descripción de Roles

| Rol | Descripción | Acceso |
|-----|-------------|--------|
| **Admin** | Administrador del sistema con acceso completo | Gestión de metadatos + CRUD de datos |
| **User** | Usuario operativo que gestiona datos | Solo CRUD de datos |

---

## 6. Requerimientos No Funcionales

### 6.1 Seguridad

| Requisito | Descripción | Implementación |
|-----------|-------------|----------------|
| RNF-SEC-01 | Autenticación segura | JWT con expiración de 24 horas |
| RNF-SEC-02 | Passwords seguros | Hash con bcrypt (salt rounds: 12) |
| RNF-SEC-03 | Prevención SQL Injection | Parámetros SQLAlchemy, nunca concatenación |
| RNF-SEC-04 | Autorización por roles | Middleware que verifica rol en cada request |
| RNF-SEC-05 | CORS configurado | Solo dominios permitidos |
| RNF-SEC-06 | Tokens no expuestos | JWT en header Authorization, no en URL |

### 6.2 Performance

| Requisito | Descripción | Objetivo |
|-----------|-------------|----------|
| RNF-PERF-01 | Tiempo de respuesta API | < 500ms para operaciones CRUD |
| RNF-PERF-02 | Tiempo de carga de página | < 3 segundos en primera carga |
| RNF-PERF-03 | Paginación eficiente | LIMIT/OFFSET con índices apropiados |
| RNF-PERF-04 | Conexiones a BD | Pool de conexiones SQLAlchemy |

### 6.3 Disponibilidad

| Requisito | Descripción | Objetivo |
|-----------|-------------|----------|
| RNF-DISP-01 | Uptime del sistema | > 95% (para MVP/demo) |
| RNF-DISP-02 | Recuperación ante fallos | Reinicio automático de containers |
| RNF-DISP-03 | Persistencia de datos | Volúmenes Docker / BD gestionada |

### 6.4 Observabilidad

| Requisito | Descripción | Implementación |
|-----------|-------------|----------------|
| RNF-OBS-01 | Logging de errores | Logs estructurados en consola |
| RNF-OBS-02 | Logs de acceso | Middleware que registra requests |
| RNF-OBS-03 | Documentación API | Swagger UI auto-generado por FastAPI |

### 6.5 Usabilidad

| Requisito | Descripción | Objetivo |
|-----------|-------------|----------|
| RNF-USA-01 | Diseño responsive | Funcional en desktop y móvil |
| RNF-USA-02 | Feedback visual | Spinners, mensajes de éxito/error |
| RNF-USA-03 | Validaciones claras | Mensajes de error descriptivos |
| RNF-USA-04 | Navegación intuitiva | Sidebar con menú claro |

### 6.6 Mantenibilidad

| Requisito | Descripción | Implementación |
|-----------|-------------|----------------|
| RNF-MANT-01 | Código organizado | Clean Architecture (4 capas) |
| RNF-MANT-02 | Dependencias documentadas | requirements.txt / package.json |
| RNF-MANT-03 | Configuración externalizada | Variables de entorno (.env) |
| RNF-MANT-04 | Migraciones versionadas | Alembic para cambios de schema |

---

## 7. Glosario de Términos

| Término | Definición |
|---------|------------|
| **Entidad** | Estructura de datos definida por el usuario, equivalente a una tabla de base de datos. Ejemplo: "Productos", "Clientes". |
| **Campo (Field)** | Atributo de una entidad, equivalente a una columna de tabla. Tiene tipo, nombre y configuraciones. |
| **Metadatos** | Información que describe las entidades y campos: nombres, tipos, validaciones. Se almacena en tablas especiales. |
| **Tabla dinámica** | Tabla de PostgreSQL creada automáticamente al definir una entidad. Nombre: `entity_{uuid}`. |
| **CRUD** | Create, Read, Update, Delete - Las cuatro operaciones básicas sobre datos. |
| **CRUD dinámico** | Sistema que ejecuta operaciones CRUD sobre cualquier entidad basándose en metadatos. |
| **Query dinámico** | Consulta SQL construida en tiempo de ejecución según los metadatos de la entidad. |
| **DDL dinámico** | Sentencias CREATE TABLE y ALTER TABLE ejecutadas en tiempo de ejecución. |
| **JWT** | JSON Web Token - Estándar para tokens de autenticación seguros. |
| **Clean Architecture** | Patrón de arquitectura que separa el código en capas independientes. |
| **Formulario dinámico** | Formulario HTML generado en tiempo de ejecución según los campos de una entidad. |
| **Listado dinámico** | Tabla HTML generada en tiempo de ejecución según los campos de una entidad. |
| **Paginación** | Técnica para dividir resultados en páginas, mejorando rendimiento y usabilidad. |
| **Hard delete** | Eliminación permanente de un registro (vs. soft delete que solo marca como eliminado). |
| **Migración** | Script que modifica el esquema de base de datos de forma versionada y reproducible. |
| **Rol** | Perfil de usuario que determina sus permisos en el sistema (Admin, User). |
| **Endpoint** | URL específica de una API que responde a un tipo de petición HTTP. |
| **Repository** | Patrón de diseño que abstrae el acceso a datos de la lógica de negocio. |
| **Service** | Capa que contiene la lógica de negocio, orquestando repositorios y validaciones. |
| **DTO** | Data Transfer Object - Objeto usado para transferir datos entre capas. |
| **ORM** | Object-Relational Mapping - Técnica para mapear objetos a tablas de BD. |
| **SQLAlchemy Core** | Modo de SQLAlchemy para ejecutar SQL dinámico sin modelos predefinidos. |

---

## 8. Instrucciones de Instalación

### 8.1 Requisitos Previos

| Software | Versión mínima | Propósito |
|----------|----------------|-----------|
| Docker | 20.10+ | Contenedores |
| Docker Compose | 2.0+ | Orquestación local |
| Python | 3.12+ | Backend |
| Node.js | 18+ | Frontend |
| Git | 2.30+ | Control de versiones |

### 8.2 Instalación Local

#### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/[usuario]/metabuilder.git
cd metabuilder
```

#### Paso 2: Levantar PostgreSQL con Docker

```bash
docker-compose up -d postgres
```

#### Paso 3: Configurar Backend

```bash
# Crear entorno virtual
cd backend
python -m venv venv

# Activar entorno (Windows)
venv\Scripts\activate

# Activar entorno (Linux/Mac)
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# Ejecutar migraciones
alembic upgrade head

# Iniciar servidor
uvicorn app.main:app --reload --port 8000
```

#### Paso 4: Configurar Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con URL del backend

# Iniciar servidor de desarrollo
npm run dev
```

#### Paso 5: Verificar instalación

- Backend: http://localhost:8000/docs (Swagger UI)
- Frontend: http://localhost:5173

### 8.3 Variables de Entorno

#### Backend (.env)

```env
# Base de datos
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/metabuilder

# JWT
JWT_SECRET_KEY=tu-clave-secreta-muy-larga-y-segura
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Entorno
ENVIRONMENT=development
```

#### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000/api
```

### 8.4 Credenciales de Demo

| Usuario | Password | Rol |
|---------|----------|-----|
| admin | Admin123! | Admin |
| user | User123! | User |

### 8.5 Docker Compose Completo (Opcional)

```bash
# Levantar todo el stack
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

---

## 9. Tecnologías Utilizadas

### Backend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Python | 3.12 | Lenguaje de programación |
| FastAPI | 0.104+ | Framework web |
| SQLAlchemy | 2.0+ | ORM y acceso a datos |
| Alembic | 1.12+ | Migraciones de BD |
| Pydantic | 2.0+ | Validación de datos |
| PyJWT | 2.8+ | Tokens JWT |
| bcrypt | 4.0+ | Hash de passwords |
| psycopg2 | 2.9+ | Driver PostgreSQL |
| uvicorn | 0.24+ | Servidor ASGI |

### Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 18+ | Framework UI |
| TypeScript | 5+ | Tipado estático |
| Vite | 5+ | Build tool |
| TailwindCSS | 3+ | Framework CSS |
| Axios | 1.6+ | Cliente HTTP |
| React Router | 6+ | Routing |

### Base de Datos

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| PostgreSQL | 15+ | Base de datos relacional |

### DevOps

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Docker | 20.10+ | Contenedores |
| Docker Compose | 2.0+ | Orquestación local |
| GitHub Actions | - | CI/CD |
| Railway | - | Hosting backend |
| Vercel | - | Hosting frontend |

---

*Última actualización: Enero 2026*

# Historias de Usuario - MetaBuilder

## Resumen del Backlog

| Épica | ID | Historias | Horas | Estado |
|-------|-----|-----------|-------|--------|
| EP-01 | Setup y Configuración | US-001 a US-005 | 2h | Pendiente |
| EP-02 | Autenticación JWT | US-006 a US-009 | 2h | Pendiente |
| EP-03 | Gestión de Metadatos (BE) | US-010 a US-017 | 6h | Pendiente |
| EP-04 | Motor CRUD Dinámico (BE) | US-018 a US-024 | 8h | Pendiente |
| EP-05 | Frontend Admin | US-025 a US-030 | 4h | Pendiente |
| EP-06 | Frontend CRUD Dinámico | US-031 a US-037 | 6h | Pendiente |
| EP-07 | Deploy y Documentación | US-038 a US-041 | 2h | Pendiente |
| **Total** | | **41 historias** | **30h** | |

---

# ÉPICA 01: Setup y Configuración Inicial

**Objetivo**: Preparar el ambiente de desarrollo y estructura base del proyecto.  
**Tiempo estimado**: 2 horas

---

## US-001: Configurar estructura de proyecto backend

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-001 |
| **Título** | Configurar estructura de proyecto backend |
| **Épica** | EP-01: Setup y Configuración |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 30 min |
| **Dependencias** | Ninguna |

### Historia

**Como** desarrollador backend  
**Quiero** tener el proyecto Python configurado con Clean Architecture  
**Para** mantener el código organizado, testeable y escalable

### Descripción

Crear la estructura inicial del proyecto backend siguiendo el patrón Clean Architecture con 4 capas: Domain, Application, Infrastructure y API.

### Criterios de Aceptación

```gherkin
Scenario: Estructura de carpetas creada correctamente
  Given que el proyecto backend no existe
  When creo la estructura de carpetas siguiendo Clean Architecture
  Then debe existir la carpeta app/ con subcarpetas domain/, application/, infrastructure/, api/
  And cada carpeta debe tener su archivo __init__.py
  And debe existir el archivo requirements.txt con dependencias base

Scenario: Dependencias instalables
  Given que existe el archivo requirements.txt
  When ejecuto pip install -r requirements.txt
  Then todas las dependencias se instalan sin errores
  And FastAPI, SQLAlchemy, Pydantic y Alembic están disponibles
```

### Notas Técnicas

- Usar Python 3.12+
- Incluir: FastAPI, SQLAlchemy, Pydantic, Alembic, python-jose, passlib, bcrypt

---

## US-002: Configurar Docker Compose con PostgreSQL

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-002 |
| **Título** | Configurar Docker Compose con PostgreSQL |
| **Épica** | EP-01: Setup y Configuración |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 20 min |
| **Dependencias** | US-001 |

### Historia

**Como** desarrollador  
**Quiero** tener PostgreSQL corriendo en Docker  
**Para** no depender de instalaciones locales y tener un ambiente consistente

### Descripción

Crear archivo docker-compose.yml que levante PostgreSQL 15 con persistencia de datos.

### Criterios de Aceptación

```gherkin
Scenario: PostgreSQL se levanta correctamente
  Given que existe el archivo docker-compose.yml
  When ejecuto docker-compose up -d postgres
  Then el contenedor de PostgreSQL está corriendo en puerto 5432
  And puedo conectarme con las credenciales configuradas

Scenario: Los datos persisten al reiniciar
  Given que PostgreSQL está corriendo
  And he insertado datos de prueba
  When ejecuto docker-compose down y luego docker-compose up -d
  Then los datos de prueba siguen existiendo
```

---

## US-003: Configurar repositorio Git

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-003 |
| **Título** | Configurar repositorio Git y estructura de carpetas |
| **Épica** | EP-01: Setup y Configuración |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 20 min |
| **Dependencias** | US-001 |

### Historia

**Como** desarrollador  
**Quiero** tener el proyecto en GitHub con estructura clara  
**Para** tener control de versiones y colaborar efectivamente

### Descripción

Crear repositorio en GitHub con .gitignore apropiado y README básico.

### Criterios de Aceptación

```gherkin
Scenario: Repositorio configurado
  Given que no existe el repositorio
  When creo el repositorio en GitHub
  Then el repositorio es público y accesible
  And existe un archivo .gitignore que excluye __pycache__, venv/, .env, node_modules/
  And existe un README.md con nombre y descripción del proyecto
```

---

## US-004: Configurar SQLAlchemy y Alembic

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-004 |
| **Título** | Configurar SQLAlchemy y Alembic para migraciones |
| **Épica** | EP-01: Setup y Configuración |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 30 min |
| **Dependencias** | US-002 |

### Historia

**Como** desarrollador backend  
**Quiero** configurar SQLAlchemy con PostgreSQL y Alembic  
**Para** poder crear y gestionar la base de datos con migraciones versionadas

### Descripción

Configurar conexión a PostgreSQL mediante SQLAlchemy e inicializar Alembic para migraciones.

### Criterios de Aceptación

```gherkin
Scenario: Conexión a base de datos funcional
  Given que PostgreSQL está corriendo
  And existe el archivo database.py con la configuración
  When importo el engine y ejecuto una query de prueba
  Then la conexión es exitosa

Scenario: Alembic genera migraciones
  Given que Alembic está inicializado
  And existe al menos un modelo SQLAlchemy
  When ejecuto alembic revision --autogenerate
  Then se crea un archivo de migración en alembic/versions/
  And el archivo contiene los cambios detectados
```

---

## US-005: Configurar proyecto React con Vite y TailwindCSS

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-005 |
| **Título** | Configurar proyecto React con Vite y TailwindCSS |
| **Épica** | EP-01: Setup y Configuración |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 20 min |
| **Dependencias** | US-003 |

### Historia

**Como** desarrollador frontend  
**Quiero** tener el proyecto React configurado con TypeScript y TailwindCSS  
**Para** empezar a desarrollar la interfaz de usuario

### Descripción

Crear proyecto React con Vite, TypeScript, TailwindCSS, React Router y Axios.

### Criterios de Aceptación

```gherkin
Scenario: Proyecto React funciona
  Given que no existe el directorio frontend/
  When creo el proyecto con Vite y configuro las dependencias
  Then npm run dev inicia el servidor en http://localhost:5173
  And las clases de TailwindCSS funcionan correctamente
  And TypeScript compila sin errores
```

---

# ÉPICA 02: Autenticación y Autorización JWT

**Objetivo**: Implementar sistema de usuarios y autenticación con JWT.  
**Tiempo estimado**: 2 horas

---

## US-006: Crear entidad User y tabla en base de datos

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-006 |
| **Título** | Crear entidad User y tabla en base de datos |
| **Épica** | EP-02: Autenticación JWT |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 20 min |
| **Dependencias** | US-004 |

### Historia

**Como** desarrollador backend  
**Quiero** tener un modelo de usuario en el dominio y su tabla correspondiente  
**Para** gestionar la autenticación de usuarios

### Descripción

Crear clase User en domain/entities.py y modelo SQLAlchemy UserModel con migración Alembic.

### Criterios de Aceptación

```gherkin
Scenario: Tabla users existe
  Given que he definido UserModel con SQLAlchemy
  When ejecuto alembic upgrade head
  Then la tabla users existe en PostgreSQL
  And tiene columnas: id, username, email, password_hash, role, created_at
  And username tiene constraint UNIQUE
```

---

## US-007: Implementar servicio de autenticación y JWT

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-007 |
| **Título** | Implementar servicio de autenticación y JWT |
| **Épica** | EP-02: Autenticación JWT |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 45 min |
| **Dependencias** | US-006 |

### Historia

**Como** desarrollador backend  
**Quiero** un servicio que genere y valide tokens JWT  
**Para** proteger los endpoints de la API

### Descripción

Implementar AuthService con métodos register y login, y JwtService para manejo de tokens.

### Criterios de Aceptación

```gherkin
Scenario: Registro de usuario exitoso
  Given que el username "testuser" no existe
  When registro un usuario con password "Test123!"
  Then el usuario se crea con password hasheado (bcrypt)
  And el password original no se almacena en la base de datos

Scenario: Login genera token JWT
  Given que existe el usuario "admin" con password "Admin123!"
  When hago login con credenciales correctas
  Then recibo un token JWT válido
  And el token contiene claims: sub (user_id), username, role, exp

Scenario: Login con credenciales incorrectas
  Given que existe el usuario "admin"
  When hago login con password incorrecto
  Then recibo un error de autenticación (401)
```

---

## US-008: Crear endpoints de autenticación

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-008 |
| **Título** | Crear endpoints de autenticación (AuthRouter) |
| **Épica** | EP-02: Autenticación JWT |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 30 min |
| **Dependencias** | US-007 |

### Historia

**Como** usuario  
**Quiero** poder registrarme y hacer login mediante la API  
**Para** acceder al sistema

### Descripción

Crear router de autenticación con endpoints POST /api/auth/register y POST /api/auth/login.

### Criterios de Aceptación

```gherkin
Scenario: Endpoint de registro funciona
  Given que la API está corriendo
  When envío POST /api/auth/register con datos válidos
  Then recibo status 201 y datos del usuario creado

Scenario: Endpoint de login funciona
  Given que existe el usuario "admin"
  When envío POST /api/auth/login con credenciales correctas
  Then recibo status 200 con token JWT y datos del usuario

Scenario: Endpoints documentados en Swagger
  Given que la API está corriendo
  When accedo a /docs
  Then veo los endpoints de auth documentados con schemas
```

---

## US-009: Configurar middleware de autorización

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-009 |
| **Título** | Configurar middleware de autorización |
| **Épica** | EP-02: Autenticación JWT |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 25 min |
| **Dependencias** | US-008 |

### Historia

**Como** desarrollador backend  
**Quiero** proteger endpoints con dependencias FastAPI  
**Para** que solo usuarios autenticados accedan a recursos protegidos

### Descripción

Crear dependencias get_current_user y get_current_admin para validar JWT y roles.

### Criterios de Aceptación

```gherkin
Scenario: Request sin token es rechazado
  Given que existe un endpoint protegido
  When envío request sin header Authorization
  Then recibo status 401 Unauthorized

Scenario: Request con token inválido es rechazado
  Given que existe un endpoint protegido
  When envío request con token inválido o expirado
  Then recibo status 401 Unauthorized

Scenario: Request con token válido es aceptado
  Given que existe un endpoint protegido
  And tengo un token JWT válido
  When envío request con header Authorization: Bearer {token}
  Then el request es procesado exitosamente

Scenario: Endpoint de admin rechaza usuarios normales
  Given que existe un endpoint que requiere rol Admin
  And tengo un token de usuario con rol User
  When envío request al endpoint de admin
  Then recibo status 403 Forbidden
```

---

# ÉPICA 03: Gestión de Metadatos (Backend)

**Objetivo**: Implementar CRUD de entidades y campos con creación dinámica de tablas.  
**Tiempo estimado**: 6 horas

---

## US-010: Crear entidades de dominio para metadatos

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-010 |
| **Título** | Crear entidades de dominio para metadatos |
| **Épica** | EP-03: Gestión de Metadatos |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 20 min |
| **Dependencias** | US-004 |

### Historia

**Como** desarrollador backend  
**Quiero** tener modelos de Entity y EntityField en el dominio  
**Para** representar los metadatos de entidades dinámicas

### Descripción

Crear clases Entity, EntityField y enum FieldType en domain/entities.py.

### Criterios de Aceptación

```gherkin
Scenario: Clases de dominio creadas
  Given que no existen las clases de metadatos
  When creo Entity y EntityField con sus propiedades
  Then Entity tiene: id, name, display_name, description, table_name, created_at
  And EntityField tiene: id, entity_id, name, display_name, field_type, is_required, max_length, column_name, display_order
  And FieldType tiene valores: TEXT, NUMBER, INTEGER, DATE, BOOLEAN
```

---

## US-011: Crear tablas de metadatos en base de datos

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-011 |
| **Título** | Crear tablas de metadatos en base de datos |
| **Épica** | EP-03: Gestión de Metadatos |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 25 min |
| **Dependencias** | US-010 |

### Historia

**Como** desarrollador backend  
**Quiero** que las tablas entities y entity_fields existan en PostgreSQL  
**Para** almacenar los metadatos de entidades dinámicas

### Descripción

Crear modelos SQLAlchemy y migración Alembic para tablas de metadatos.

### Criterios de Aceptación

```gherkin
Scenario: Tablas de metadatos existen
  Given que he definido los modelos SQLAlchemy
  When ejecuto alembic upgrade head
  Then existe la tabla entities con constraints correctos
  And existe la tabla entity_fields con FK a entities
  And entity_fields tiene CASCADE DELETE configurado
```

---

## US-012: Implementar MetadataRepository

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-012 |
| **Título** | Implementar MetadataRepository |
| **Épica** | EP-03: Gestión de Metadatos |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 45 min |
| **Dependencias** | US-011 |

### Historia

**Como** desarrollador backend  
**Quiero** un repositorio para gestionar metadatos  
**Para** separar la lógica de acceso a datos de la lógica de negocio

### Descripción

Crear MetadataRepository con métodos CRUD para entidades y campos usando SQLAlchemy ORM.

### Criterios de Aceptación

```gherkin
Scenario: CRUD de entidades funciona
  Given que MetadataRepository está implementado
  When creo, leo, actualizo y elimino una entidad
  Then todas las operaciones se ejecutan correctamente
  And get_entity_by_id incluye los campos relacionados (joinedload)

Scenario: CRUD de campos funciona
  Given que existe una entidad
  When agrego, listo y elimino campos
  Then todas las operaciones se ejecutan correctamente
  And los campos se eliminan cuando se elimina la entidad (cascade)
```

---

## US-013: Implementar MetadataService con lógica de negocio

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-013 |
| **Título** | Implementar MetadataService con lógica de negocio |
| **Épica** | EP-03: Gestión de Metadatos |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 60 min |
| **Dependencias** | US-012 |

### Historia

**Como** desarrollador backend  
**Quiero** un servicio que orqueste las operaciones de metadatos  
**Para** aplicar validaciones y lógica de negocio antes de persistir

### Descripción

Implementar MetadataService que valide datos, genere nombres de tabla y coordine con el repositorio.

### Criterios de Aceptación

```gherkin
Scenario: Crear entidad genera table_name automático
  Given que voy a crear una entidad con name "productos"
  When creo la entidad via MetadataService
  Then table_name se genera como "entity_{uuid}"
  And la entidad se guarda en base de datos

Scenario: Validación de nombre duplicado
  Given que existe una entidad con name "productos"
  When intento crear otra entidad con name "productos"
  Then recibo un error de nombre duplicado
  And la entidad no se crea

Scenario: Agregar campo valida nombre único en entidad
  Given que existe una entidad con campo "nombre"
  When intento agregar otro campo "nombre" a la misma entidad
  Then recibo un error de campo duplicado
```

---

## US-014: Crear DTOs para metadatos

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-014 |
| **Título** | Crear DTOs para metadatos |
| **Épica** | EP-03: Gestión de Metadatos |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 30 min |
| **Dependencias** | US-010 |

### Historia

**Como** desarrollador backend  
**Quiero** DTOs para requests y responses de metadatos  
**Para** no exponer entidades de dominio directamente y validar inputs

### Descripción

Crear DTOs con Pydantic para crear/actualizar entidades y campos.

### Criterios de Aceptación

```gherkin
Scenario: DTOs validan inputs
  Given que tengo CreateEntityRequest con campos requeridos
  When envío un request sin campo name
  Then Pydantic lanza ValidationError
  And el mensaje indica qué campo falta

Scenario: Mapeo funciona correctamente
  Given que tengo una Entity de dominio
  When la convierto a EntityResponse
  Then todos los campos se mapean correctamente
  And los campos sensibles no se exponen
```

---

## US-015: Crear MetadataRouter con endpoints REST

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-015 |
| **Título** | Crear MetadataRouter con endpoints REST |
| **Épica** | EP-03: Gestión de Metadatos |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 60 min |
| **Dependencias** | US-013, US-014 |

### Historia

**Como** administrador  
**Quiero** endpoints REST para gestionar entidades y campos  
**Para** poder crear y configurar entidades desde el frontend

### Descripción

Crear router con endpoints CRUD para entidades y campos, protegidos con rol Admin.

### Criterios de Aceptación

```gherkin
Scenario: CRUD de entidades via API
  Given que estoy autenticado como Admin
  When ejecuto operaciones CRUD en /api/metadata/entities
  Then todas las operaciones responden correctamente
  And las validaciones retornan 400 con mensajes claros

Scenario: Solo Admin puede acceder
  Given que estoy autenticado como User (no Admin)
  When intento acceder a /api/metadata/entities
  Then recibo status 403 Forbidden

Scenario: Swagger documenta los endpoints
  Given que la API está corriendo
  When accedo a /docs
  Then veo todos los endpoints de metadata documentados
```

---

## US-016: Implementar creación dinámica de tablas

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-016 |
| **Título** | Implementar creación dinámica de tablas |
| **Épica** | EP-03: Gestión de Metadatos |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 90 min |
| **Dependencias** | US-013 |

### Historia

**Como** administrador  
**Quiero** que al crear una entidad se cree automáticamente su tabla en PostgreSQL  
**Para** poder almacenar registros de esa entidad inmediatamente

### Descripción

Implementar TableManager que ejecute CREATE TABLE dinámico basado en metadatos.

### Criterios de Aceptación

```gherkin
Scenario: Crear entidad genera tabla física
  Given que voy a crear la entidad "productos"
  When creo la entidad via API
  Then existe una tabla entity_{uuid} en PostgreSQL
  And la tabla tiene columnas: id (UUID PK), created_at (TIMESTAMP)

Scenario: Mapeo de tipos es correcto
  Given que tengo campos de diferentes tipos
  When creo la entidad con sus campos
  Then TEXT -> VARCHAR(n), NUMBER -> DECIMAL(10,2), INTEGER -> INTEGER
  And DATE -> DATE, BOOLEAN -> BOOLEAN
```

---

## US-017: Implementar ALTER TABLE al agregar campos

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-017 |
| **Título** | Implementar ALTER TABLE al agregar campos |
| **Épica** | EP-03: Gestión de Metadatos |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 45 min |
| **Dependencias** | US-016 |

### Historia

**Como** administrador  
**Quiero** poder agregar campos a entidades existentes  
**Para** extender entidades sin perder datos existentes

### Descripción

Implementar método en TableManager para ejecutar ALTER TABLE ADD COLUMN.

### Criterios de Aceptación

```gherkin
Scenario: Agregar campo modifica tabla
  Given que existe la entidad "productos" con registros
  When agrego un campo "categoria" tipo TEXT
  Then la tabla tiene la nueva columna
  And los registros existentes tienen NULL en el nuevo campo

Scenario: Error de ALTER revierte cambios
  Given que voy a agregar un campo con nombre inválido
  When falla el ALTER TABLE
  Then el campo no se guarda en metadatos
  And la tabla queda en estado consistente
```

---

# ÉPICA 04: Motor de CRUD Dinámico (Backend)

**Objetivo**: Implementar operaciones CRUD sobre tablas dinámicas.  
**Tiempo estimado**: 8 horas

---

## US-018: Crear repositorio de datos dinámicos

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-018 |
| **Título** | Crear repositorio de datos dinámicos con SQLAlchemy Core |
| **Épica** | EP-04: Motor CRUD Dinámico |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 45 min |
| **Dependencias** | US-016 |

### Historia

**Como** desarrollador backend  
**Quiero** un repositorio que ejecute queries dinámicas  
**Para** interactuar con tablas creadas dinámicamente

### Descripción

Crear DynamicDataRepository usando SQLAlchemy Core para ejecutar SQL sobre tablas dinámicas.

### Criterios de Aceptación

```gherkin
Scenario: Repositorio ejecuta queries sobre tabla dinámica
  Given que existe la tabla entity_abc123
  When ejecuto get_records("entity_abc123")
  Then recibo los registros de la tabla
  And los parámetros previenen SQL injection
```

---

## US-019: Implementar DynamicQueryBuilder

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-019 |
| **Título** | Implementar DynamicQueryBuilder |
| **Épica** | EP-04: Motor CRUD Dinámico |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 90 min |
| **Dependencias** | US-018 |

### Historia

**Como** desarrollador backend  
**Quiero** una clase que construya queries SQL dinámicas  
**Para** generar INSERT, SELECT, UPDATE, DELETE según metadatos

### Descripción

Implementar QueryBuilder que genere SQL seguro con parámetros nombrados.

### Criterios de Aceptación

```gherkin
Scenario: Genera INSERT correcto
  Given que tengo metadatos de entidad "productos" con campos nombre, precio
  When construyo query de INSERT con datos {"nombre": "Laptop", "precio": 999}
  Then el SQL generado es: INSERT INTO entity_x (nombre, precio) VALUES (:nombre, :precio) RETURNING id
  And los parámetros están separados del SQL

Scenario: Genera SELECT con paginación
  Given que tengo metadatos de entidad
  When construyo query de SELECT con page=2, page_size=20
  Then el SQL incluye LIMIT 20 OFFSET 20
```

---

## US-020: Implementar validador de datos dinámicos

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-020 |
| **Título** | Implementar validador de datos dinámicos |
| **Épica** | EP-04: Motor CRUD Dinámico |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 60 min |
| **Dependencias** | US-012 |

### Historia

**Como** desarrollador backend  
**Quiero** validar datos antes de insertarlos  
**Para** asegurar integridad de datos según metadatos

### Descripción

Implementar DataValidator que valide campos requeridos, tipos y max_length.

### Criterios de Aceptación

```gherkin
Scenario: Valida campos requeridos
  Given que el campo "nombre" es requerido
  When valido datos sin campo "nombre"
  Then recibo error: "El campo 'nombre' es requerido"

Scenario: Valida tipos de datos
  Given que el campo "precio" es tipo NUMBER
  When valido datos con precio = "abc"
  Then recibo error: "El campo 'precio' debe ser un número"

Scenario: Valida max_length
  Given que el campo "nombre" tiene max_length 50
  When valido datos con nombre de 100 caracteres
  Then recibo error: "El campo 'nombre' excede la longitud máxima de 50"
```

---

## US-021: Implementar DynamicCrudService

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-021 |
| **Título** | Implementar DynamicCrudService |
| **Épica** | EP-04: Motor CRUD Dinámico |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 120 min |
| **Dependencias** | US-019, US-020 |

### Historia

**Como** desarrollador backend  
**Quiero** un servicio que orqueste operaciones CRUD dinámicas  
**Para** centralizar la lógica de negocio del CRUD genérico

### Descripción

Implementar servicio que coordine metadatos, validación, construcción de queries y ejecución.

### Criterios de Aceptación

```gherkin
Scenario: Crear registro completo
  Given que existe la entidad "productos" con campos
  When creo un registro con datos válidos
  Then el registro se inserta en la tabla dinámica
  And recibo el registro con id generado

Scenario: Listar registros con paginación
  Given que existen 50 registros
  When listo con page=1, page_size=20
  Then recibo 20 registros
  And recibo metadata de paginación: total_records=50, total_pages=3

Scenario: Error de validación retorna errores claros
  Given que voy a crear un registro con datos inválidos
  When intento crear el registro
  Then recibo lista de errores de validación
  And el registro no se crea
```

---

## US-022: Crear DTOs para CRUD dinámico

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-022 |
| **Título** | Crear DTOs para CRUD dinámico |
| **Épica** | EP-04: Motor CRUD Dinámico |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 20 min |
| **Dependencias** | US-014 |

### Historia

**Como** desarrollador backend  
**Quiero** DTOs para requests y responses del CRUD dinámico  
**Para** tener contratos claros de entrada y salida

### Descripción

Crear DTOs para crear/actualizar registros y respuestas paginadas.

### Criterios de Aceptación

```gherkin
Scenario: DTOs representan datos dinámicos
  Given que la entidad tiene campos nombre y precio
  When creo un registro
  Then el request acepta {"nombre": "X", "precio": 99}
  And el response incluye id, created_at y los datos

Scenario: Paginación incluye toda la info
  Given que listo registros
  When recibo la respuesta
  Then incluye: records[], pagination{page, page_size, total_records, total_pages}
```

---

## US-023: Crear CrudRouter con endpoints REST

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-023 |
| **Título** | Crear CrudRouter con endpoints REST |
| **Épica** | EP-04: Motor CRUD Dinámico |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 75 min |
| **Dependencias** | US-021, US-022 |

### Historia

**Como** usuario  
**Quiero** endpoints para hacer CRUD de registros  
**Para** gestionar datos de las entidades

### Descripción

Crear router con endpoints CRUD genéricos para cualquier entidad.

### Criterios de Aceptación

```gherkin
Scenario: CRUD completo funciona
  Given que existe la entidad "productos"
  And estoy autenticado
  When creo, leo, actualizo y elimino un registro
  Then todas las operaciones funcionan correctamente
  And recibo status codes apropiados (201, 200, 200, 204)

Scenario: Entidad no encontrada retorna 404
  Given que no existe la entidad con id "xxx"
  When intento listar registros de esa entidad
  Then recibo status 404

Scenario: Admin y User pueden acceder
  Given que estoy autenticado como User
  When accedo a los endpoints de CRUD
  Then tengo acceso (no es exclusivo de Admin)
```

---

## US-024: Implementar manejo global de errores

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-024 |
| **Título** | Implementar manejo global de errores |
| **Épica** | EP-04: Motor CRUD Dinámico |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 30 min |
| **Dependencias** | US-023 |

### Historia

**Como** desarrollador backend  
**Quiero** un exception handler global  
**Para** retornar respuestas de error consistentes

### Descripción

Implementar middleware de manejo de errores que capture excepciones y retorne JSON estructurado.

### Criterios de Aceptación

```gherkin
Scenario: Errores retornan JSON consistente
  Given que ocurre un error de validación
  When la API responde
  Then el JSON tiene formato: {success: false, error: {code, message, details}}

Scenario: Errores 500 no exponen detalles internos
  Given que ocurre una excepción no controlada
  When la API responde
  Then el mensaje es genérico "Error interno del servidor"
  And los detalles internos se loguean pero no se exponen
```

---

# ÉPICA 05: Frontend - Administración de Entidades

**Objetivo**: Interfaz para que admins creen entidades y campos.  
**Tiempo estimado**: 4 horas

---

## US-025: Configurar servicios de API en frontend

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-025 |
| **Título** | Configurar servicios de API y autenticación en frontend |
| **Épica** | EP-05: Frontend Admin |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 45 min |
| **Dependencias** | US-005, US-008 |

### Historia

**Como** desarrollador frontend  
**Quiero** servicios para consumir el backend  
**Para** centralizar las llamadas HTTP y manejo de auth

### Descripción

Crear servicios con Axios y contexto de autenticación con React Context.

### Criterios de Aceptación

```gherkin
Scenario: Axios intercepta requests
  Given que el usuario está autenticado
  When hago una llamada a la API
  Then el header Authorization se agrega automáticamente

Scenario: useAuth provee estado de autenticación
  Given que estoy en un componente React
  When uso el hook useAuth
  Then tengo acceso a: user, login(), logout(), isAuthenticated
```

---

## US-026: Crear página de Login

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-026 |
| **Título** | Crear página de Login |
| **Épica** | EP-05: Frontend Admin |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 30 min |
| **Dependencias** | US-025 |

### Historia

**Como** usuario  
**Quiero** una pantalla de login  
**Para** autenticarme en el sistema

### Descripción

Crear página de login con formulario y manejo de errores.

### Criterios de Aceptación

```gherkin
Scenario: Login exitoso
  Given que estoy en la página de login
  When ingreso credenciales correctas
  Then soy redirigido al dashboard
  And el token se guarda en localStorage

Scenario: Login fallido muestra error
  Given que estoy en la página de login
  When ingreso credenciales incorrectas
  Then veo un mensaje de error claro
  And permanezco en la página de login
```

---

## US-027: Crear layout principal con sidebar

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-027 |
| **Título** | Crear layout principal con sidebar |
| **Épica** | EP-05: Frontend Admin |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 45 min |
| **Dependencias** | US-026 |

### Historia

**Como** usuario  
**Quiero** una navegación clara con sidebar  
**Para** acceder fácilmente a las diferentes secciones

### Descripción

Crear Layout con Sidebar (navegación) y Header (usuario, logout).

### Criterios de Aceptación

```gherkin
Scenario: Sidebar muestra opciones según rol
  Given que estoy autenticado como Admin
  When veo el sidebar
  Then veo opciones: Dashboard, Admin Entidades, Entidades

Scenario: Usuario normal no ve Admin
  Given que estoy autenticado como User
  When veo el sidebar
  Then NO veo la opción "Admin Entidades"

Scenario: Logout funciona
  Given que estoy autenticado
  When hago clic en Logout
  Then soy redirigido a /login
  And el token se elimina de localStorage
```

---

## US-028: Crear pantalla de listado de entidades

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-028 |
| **Título** | Crear pantalla de listado de entidades (Admin) |
| **Épica** | EP-05: Frontend Admin |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 40 min |
| **Dependencias** | US-027 |

### Historia

**Como** administrador  
**Quiero** ver todas las entidades creadas  
**Para** gestionarlas (ver, editar, eliminar)

### Descripción

Crear página que liste entidades con acciones disponibles.

### Criterios de Aceptación

```gherkin
Scenario: Lista entidades existentes
  Given que existen entidades en el sistema
  When accedo a /admin/entities
  Then veo una tabla con: Name, Display Name, # Campos, Acciones

Scenario: Acciones funcionan
  Given que veo la lista de entidades
  When hago clic en "Ver Campos"
  Then navego a la pantalla de campos de esa entidad

Scenario: Eliminar con confirmación
  Given que veo la lista de entidades
  When hago clic en "Eliminar"
  Then aparece un modal de confirmación
  And si confirmo, la entidad se elimina y la lista se actualiza
```

---

## US-029: Crear formulario de creación de entidad

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-029 |
| **Título** | Crear formulario de creación de entidad |
| **Épica** | EP-05: Frontend Admin |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 40 min |
| **Dependencias** | US-028 |

### Historia

**Como** administrador  
**Quiero** crear una nueva entidad  
**Para** definir nuevas estructuras de datos

### Descripción

Crear componente EntityBuilder con formulario de creación.

### Criterios de Aceptación

```gherkin
Scenario: Crear entidad exitosamente
  Given que estoy en el formulario de nueva entidad
  When completo nombre, display_name, descripción y guardo
  Then la entidad se crea
  And soy redirigido a la pantalla de campos

Scenario: Validación en frontend
  Given que estoy en el formulario
  When intento guardar sin completar campos requeridos
  Then veo mensajes de error en los campos
  And el formulario no se envía
```

---

## US-030: Crear formulario para agregar campos

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-030 |
| **Título** | Crear formulario para agregar campos a entidad |
| **Épica** | EP-05: Frontend Admin |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 60 min |
| **Dependencias** | US-029 |

### Historia

**Como** administrador  
**Quiero** agregar campos a una entidad  
**Para** definir su estructura de datos

### Descripción

Crear FieldManager que muestre campos existentes y permita agregar nuevos.

### Criterios de Aceptación

```gherkin
Scenario: Agregar campo exitosamente
  Given que estoy gestionando campos de una entidad
  When completo el formulario de campo y guardo
  Then el campo aparece en la lista
  And la tabla física se actualiza

Scenario: Max Length se muestra solo para TEXT
  Given que estoy agregando un campo
  When selecciono tipo TEXT
  Then el campo "Max Length" se habilita
  
Scenario: Max Length se oculta para otros tipos
  Given que estoy agregando un campo
  When selecciono tipo NUMBER o DATE
  Then el campo "Max Length" se oculta o deshabilita
```

---

# ÉPICA 06: Frontend - CRUD Dinámico de Registros

**Objetivo**: Interfaz para gestionar registros de entidades.  
**Tiempo estimado**: 6 horas

---

## US-031: Crear servicio y hook para CRUD dinámico

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-031 |
| **Título** | Crear servicio y hook para CRUD dinámico |
| **Épica** | EP-06: Frontend CRUD |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 30 min |
| **Dependencias** | US-025 |

### Historia

**Como** desarrollador frontend  
**Quiero** servicios y hooks para consumir el CRUD dinámico  
**Para** interactuar con registros de cualquier entidad

### Descripción

Crear crudService y useDynamicEntity hook.

### Criterios de Aceptación

```gherkin
Scenario: Hook maneja estado correctamente
  Given que uso useDynamicEntity(entityId)
  When cargo registros
  Then tengo acceso a: records, loading, error, loadRecords(), createRecord(), etc.
```

---

## US-032: Crear selector de entidad

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-032 |
| **Título** | Crear selector de entidad |
| **Épica** | EP-06: Frontend CRUD |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 30 min |
| **Dependencias** | US-031 |

### Historia

**Como** usuario  
**Quiero** seleccionar una entidad de una lista  
**Para** ver y gestionar sus registros

### Descripción

Crear página que muestre entidades disponibles para seleccionar.

### Criterios de Aceptación

```gherkin
Scenario: Seleccionar entidad navega a registros
  Given que veo la lista de entidades
  When hago clic en una entidad
  Then navego a /entities/{entityId}/records
```

---

## US-033: Crear tabla dinámica de registros

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-033 |
| **Título** | Crear tabla dinámica de registros |
| **Épica** | EP-06: Frontend CRUD |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 75 min |
| **Dependencias** | US-032 |

### Historia

**Como** usuario  
**Quiero** ver todos los registros de una entidad en una tabla  
**Para** consultarlos y gestionarlos

### Descripción

Crear DynamicList que genere columnas según metadatos y muestre registros.

### Criterios de Aceptación

```gherkin
Scenario: Tabla genera columnas dinámicamente
  Given que la entidad tiene campos nombre, precio, activo
  When cargo la página de registros
  Then la tabla tiene columnas: Nombre, Precio, Activo, Acciones

Scenario: Paginación funciona
  Given que hay 50 registros
  When estoy en página 1 de 3
  Then veo botones de navegación de página
  And al hacer clic en "Siguiente" cargo página 2
```

---

## US-034: Crear formulario dinámico para crear/editar

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-034 |
| **Título** | Crear formulario dinámico para crear/editar registros |
| **Épica** | EP-06: Frontend CRUD |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 90 min |
| **Dependencias** | US-033 |

### Historia

**Como** usuario  
**Quiero** un formulario que se adapte a la entidad  
**Para** crear y editar registros con los campos correctos

### Descripción

Crear DynamicForm que genere inputs según tipo de campo.

### Criterios de Aceptación

```gherkin
Scenario: Genera inputs según tipo
  Given que la entidad tiene campo fecha tipo DATE
  When abro el formulario
  Then veo un input type="date" para ese campo

Scenario: Validación de campos requeridos
  Given que el campo nombre es requerido
  When intento guardar sin completarlo
  Then veo mensaje de error en ese campo

Scenario: Crear registro exitosamente
  Given que completo el formulario correctamente
  When guardo
  Then el registro se crea
  And aparece en la lista
```

---

## US-035: Implementar funcionalidad de edición

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-035 |
| **Título** | Implementar funcionalidad de edición |
| **Épica** | EP-06: Frontend CRUD |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 30 min |
| **Dependencias** | US-034 |

### Historia

**Como** usuario  
**Quiero** editar un registro existente  
**Para** corregir o actualizar datos

### Descripción

Implementar edición que cargue datos existentes en el formulario dinámico.

### Criterios de Aceptación

```gherkin
Scenario: Formulario se llena con datos existentes
  Given que hago clic en Editar un registro
  When se abre el formulario
  Then los campos tienen los valores actuales del registro

Scenario: Actualización exitosa
  Given que edito un registro
  When guardo los cambios
  Then el registro se actualiza
  And la lista refleja los cambios
```

---

## US-036: Implementar funcionalidad de eliminación

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-036 |
| **Título** | Implementar funcionalidad de eliminación |
| **Épica** | EP-06: Frontend CRUD |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 20 min |
| **Dependencias** | US-033 |

### Historia

**Como** usuario  
**Quiero** eliminar un registro  
**Para** limpiar datos no necesarios

### Descripción

Implementar eliminación con confirmación modal.

### Criterios de Aceptación

```gherkin
Scenario: Confirmación antes de eliminar
  Given que hago clic en Eliminar
  When aparece el modal
  Then debo confirmar para proceder

Scenario: Eliminación exitosa
  Given que confirmo la eliminación
  When la operación completa
  Then el registro desaparece de la lista
  And veo mensaje de éxito
```

---

## US-037: Mejorar UX con loading states y errores

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-037 |
| **Título** | Mejorar UX con loading states y errores |
| **Épica** | EP-06: Frontend CRUD |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 45 min |
| **Dependencias** | US-036 |

### Historia

**Como** usuario  
**Quiero** feedback visual durante operaciones  
**Para** saber qué está pasando en el sistema

### Descripción

Agregar spinners, mensajes de error y estados de carga.

### Criterios de Aceptación

```gherkin
Scenario: Spinner durante carga
  Given que estoy cargando datos
  When la petición está en progreso
  Then veo un spinner de carga

Scenario: Errores se muestran amigablemente
  Given que ocurre un error
  When la petición falla
  Then veo un mensaje de error claro (no técnico)
```

---

# ÉPICA 07: Deploy y Documentación

**Objetivo**: Deploy en producción y documentación completa.  
**Tiempo estimado**: 2 horas

---

## US-038: Crear Dockerfile para backend

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-038 |
| **Título** | Crear Dockerfile para backend |
| **Épica** | EP-07: Deploy |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 20 min |
| **Dependencias** | US-023 |

### Historia

**Como** desarrollador  
**Quiero** un Dockerfile para el backend  
**Para** poder desplegarlo en cualquier plataforma

### Descripción

Crear Dockerfile multi-stage para backend Python/FastAPI.

### Criterios de Aceptación

```gherkin
Scenario: Docker build exitoso
  Given que existe el Dockerfile
  When ejecuto docker build
  Then la imagen se construye sin errores

Scenario: Container funciona
  Given que tengo la imagen construida
  When ejecuto docker run
  Then la API responde en el puerto configurado
```

---

## US-039: Configurar deploy en Railway

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-039 |
| **Título** | Configurar deploy en Railway o Render |
| **Épica** | EP-07: Deploy |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 45 min |
| **Dependencias** | US-038 |

### Historia

**Como** desarrollador  
**Quiero** el sistema desplegado públicamente  
**Para** que sea accesible para demos y evaluación

### Descripción

Configurar proyecto en Railway con backend, frontend y PostgreSQL.

### Criterios de Aceptación

```gherkin
Scenario: Sistema accesible públicamente
  Given que el deploy está configurado
  When accedo a las URLs de producción
  Then el backend y frontend funcionan correctamente
  And puedo hacer login con credenciales de demo
```

---

## US-040: Crear datos de demostración

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-040 |
| **Título** | Crear datos de demostración |
| **Épica** | EP-07: Deploy |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 25 min |
| **Dependencias** | US-039 |

### Historia

**Como** evaluador  
**Quiero** datos de ejemplo  
**Para** probar el sistema fácilmente

### Descripción

Crear script de seed con usuarios, entidades y registros de ejemplo.

### Criterios de Aceptación

```gherkin
Scenario: Datos de demo disponibles
  Given que el sistema está desplegado
  When accedo con admin/Admin123!
  Then veo al menos 2 entidades de ejemplo (Productos, Clientes)
  And cada entidad tiene registros de ejemplo
```

---

## US-041: Crear README completo

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | US-041 |
| **Título** | Crear README completo |
| **Épica** | EP-07: Deploy |
| **Prioridad** | P0 (Crítica) |
| **Estimación** | 30 min |
| **Dependencias** | US-039 |

### Historia

**Como** evaluador o desarrollador  
**Quiero** documentación clara  
**Para** entender y ejecutar el proyecto

### Descripción

Crear README.md completo con instrucciones de setup y URLs de producción.

### Criterios de Aceptación

```gherkin
Scenario: README tiene toda la información necesaria
  Given que leo el README
  When busco información
  Then encuentro: descripción, stack, arquitectura, instalación, variables de entorno, URLs de producción, credenciales de demo
```

---

# Mapa de Historias por Épica

```
EP-01: Setup (2h)
├── US-001: Estructura backend
├── US-002: Docker PostgreSQL
├── US-003: Git/GitHub
├── US-004: SQLAlchemy/Alembic
└── US-005: React/Vite/Tailwind

EP-02: Auth (2h)
├── US-006: Entidad User
├── US-007: AuthService + JWT
├── US-008: AuthRouter endpoints
└── US-009: Middleware autorización

EP-03: Metadatos BE (6h)
├── US-010: Entidades dominio
├── US-011: Tablas metadatos
├── US-012: MetadataRepository
├── US-013: MetadataService
├── US-014: DTOs metadatos
├── US-015: MetadataRouter
├── US-016: CREATE TABLE dinámico
└── US-017: ALTER TABLE campos

EP-04: CRUD BE (8h)
├── US-018: DynamicDataRepository
├── US-019: QueryBuilder
├── US-020: DataValidator
├── US-021: DynamicCrudService
├── US-022: DTOs CRUD
├── US-023: CrudRouter
└── US-024: Error handler

EP-05: Frontend Admin (4h)
├── US-025: Servicios API
├── US-026: Login page
├── US-027: Layout/Sidebar
├── US-028: Lista entidades
├── US-029: Crear entidad
└── US-030: Gestionar campos

EP-06: Frontend CRUD (6h)
├── US-031: CRUD service/hook
├── US-032: Selector entidad
├── US-033: Tabla dinámica
├── US-034: Formulario dinámico
├── US-035: Edición
├── US-036: Eliminación
└── US-037: UX/Loading/Errores

EP-07: Deploy (2h)
├── US-038: Dockerfile
├── US-039: Deploy Railway
├── US-040: Datos demo
└── US-041: README
```

---

*Última actualización: Enero 2026*

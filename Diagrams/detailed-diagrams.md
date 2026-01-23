# Diagramas Detallados

Este documento contiene diagramas adicionales y más detallados del sistema.

## 1. Diagrama de Flujo de Datos - Sistema Completo

```mermaid
flowchart TD
    Start([Usuario accede al sistema]) --> Auth{Autenticado?}
    Auth -->|No| Keycloak[Keycloak Login]
    Keycloak -->|Token| Auth
    Auth -->|Sí| CheckPerms{Verificar Permisos}
    CheckPerms -->|Sin permiso| Denied[Acceso Denegado]
    CheckPerms -->|Con permiso| Route{Ruta?}
    
    Route -->|Admin| AdminModule[Módulo Admin]
    Route -->|CRUD| CrudModule[Módulo CRUD]
    Route -->|Reportes| ReportsModule[Módulo Reportes]
    
    AdminModule --> LoadMeta[Cargar Metadatos]
    LoadMeta --> MetaAPI[API Metadatos]
    MetaAPI --> MetaDB[(Tablas Metadatos)]
    MetaAPI --> CreateTable[Crear Tabla Física]
    CreateTable --> DataDB[(Tablas Datos)]
    
    CrudModule --> LoadEntityMeta[Cargar Metadatos Entidad]
    LoadEntityMeta --> MetaAPI
    LoadEntityMeta --> BuildForm[Construir Formulario Dinámico]
    BuildForm --> UserInput[Usuario Completa Formulario]
    UserInput --> Validate[Validar Datos]
    Validate -->|Válido| CrudAPI[API CRUD]
    Validate -->|Inválido| ShowErrors[Mostrar Errores]
    ShowErrors --> UserInput
    
    CrudAPI --> QueryBuilder[Query Builder]
    QueryBuilder --> BuildSQL[Construir SQL Dinámico]
    BuildSQL --> ExecuteSQL[Ejecutar en DB]
    ExecuteSQL --> DataDB
    ExecuteSQL --> AuditLog[Registrar Auditoría]
    AuditLog --> AuditDB[(Tablas Auditoría)]
    ExecuteSQL --> CreateVersion[Crear Versión]
    CreateVersion --> VersionsDB[(Tablas Versiones)]
    
    ReportsModule --> ReportsAPI[API Reportes]
    ReportsAPI --> QueryMetrics[Consultar Métricas]
    QueryMetrics --> AuditDB
    QueryMetrics --> ErrorDB[(Tablas Errores)]
    QueryMetrics --> MetricsDB[(Tablas Métricas)]
```

## 2. Diagrama de Componentes - Backend Detallado

```mermaid
graph TB
    subgraph "API Layer"
        MetaCtrl[MetadataController]
        CrudCtrl[DynamicCrudController]
        AuditCtrl[AuditController]
        ReportsCtrl[ReportsController]
        AuthCtrl[AuthController]
    end
    
    subgraph "Application Layer"
        MetaSvc[MetadataService]
        CrudSvc[DynamicCrudService]
        AuditSvc[AuditService]
        ReportsSvc[ReportService]
        PermSvc[PermissionService]
        Validator[DataValidator]
    end
    
    subgraph "Domain Layer"
        QueryBuilder[DynamicQueryBuilder]
        EntityDef[EntityDefinition]
        FieldDef[FieldDefinition]
        RelationDef[RelationDefinition]
    end
    
    subgraph "Infrastructure Layer"
        MetaRepo[MetadataRepository]
        DataRepo[DynamicDataRepository]
        AuditRepo[AuditRepository]
        KeycloakClient[KeycloakClient]
        Logger[Logger]
    end
    
    subgraph "Database"
        MetaTables[(Tablas Metadatos)]
        DataTables[(Tablas Datos Dinámicos)]
        AuditTables[(Tablas Auditoría)]
    end
    
    subgraph "External"
        Keycloak[Keycloak Server]
    end
    
    MetaCtrl --> MetaSvc
    CrudCtrl --> CrudSvc
    AuditCtrl --> AuditSvc
    ReportsCtrl --> ReportsSvc
    AuthCtrl --> PermSvc
    
    MetaSvc --> MetaRepo
    MetaSvc --> DataRepo
    CrudSvc --> QueryBuilder
    CrudSvc --> Validator
    CrudSvc --> DataRepo
    CrudSvc --> AuditSvc
    AuditSvc --> AuditRepo
    ReportsSvc --> AuditRepo
    ReportsSvc --> MetaRepo
    PermSvc --> KeycloakClient
    
    QueryBuilder --> EntityDef
    QueryBuilder --> FieldDef
    
    MetaRepo --> MetaTables
    DataRepo --> DataTables
    AuditRepo --> AuditTables
    KeycloakClient --> Keycloak
    
    CrudSvc --> Logger
    MetaSvc --> Logger
```

## 3. Diagrama de Estados - Ciclo de Vida de un Registro

```mermaid
stateDiagram-v2
    [*] --> Created: CREATE
    
    Created --> Updated: UPDATE
    Updated --> Updated: UPDATE
    Updated --> Deleted: DELETE
    Created --> Deleted: DELETE
    
    Updated --> RolledBack: ROLLBACK
    RolledBack --> PreviousVersion: Restaurar Versión
    
    Deleted --> [*]: Soft Delete
    
    note right of Created
        Versión 1 creada
        Audit log: CREATE
    end note
    
    note right of Updated
        Nueva versión creada
        Audit log: UPDATE
    end note
    
    note right of RolledBack
        Versión anterior restaurada
        Nueva versión creada
        Audit log: ROLLBACK
    end note
```

## 4. Diagrama de Secuencia - Proceso Completo de Creación de Entidad y Registro

```mermaid
sequenceDiagram
    participant Admin
    participant Frontend
    participant API
    participant MetaService
    participant DataRepo
    participant DB
    
    Admin->>Frontend: Define nueva entidad "Productos"
    Frontend->>API: POST /api/metadata/entities
    API->>MetaService: CreateEntity(entityDef)
    MetaService->>MetaService: Validar definición
    MetaService->>DataRepo: CreateEntityTable(entity)
    DataRepo->>DB: CREATE TABLE entity_xxx
    DB-->>DataRepo: Tabla creada
    DataRepo->>DB: INSERT INTO entities
    DataRepo->>DB: INSERT INTO entity_fields
    DB-->>DataRepo: Metadatos guardados
    DataRepo-->>MetaService: Entidad creada
    MetaService-->>API: Entity con ID
    API-->>Frontend: 201 Created
    Frontend-->>Admin: Confirmación
    
    Admin->>Frontend: Crea registro de producto
    Frontend->>API: POST /api/entities/{id}/records
    Note over API: { nombre: "Laptop", precio: 1200 }
    API->>MetaService: GetEntityMetadata(id)
    MetaService->>DB: SELECT * FROM entities WHERE id=...
    DB-->>MetaService: Metadatos
    MetaService-->>API: Metadatos
    API->>CrudService: CreateRecord(entityId, data)
    CrudService->>QueryBuilder: BuildInsertQuery(metadata, data)
    QueryBuilder-->>CrudService: SQL INSERT
    CrudService->>DataRepo: ExecuteInsert(query)
    DataRepo->>DB: INSERT INTO entity_xxx VALUES (...)
    DB-->>DataRepo: Record ID
    DataRepo->>DB: INSERT INTO entity_data
    DataRepo->>DB: INSERT INTO entity_data_versions
    DataRepo->>DB: INSERT INTO audit_log
    DB-->>DataRepo: OK
    DataRepo-->>CrudService: Record creado
    CrudService-->>API: Record completo
    API-->>Frontend: 201 Created
    Frontend-->>Admin: Registro creado
```

## 5. Diagrama de Arquitectura de Datos

```mermaid
erDiagram
    entities ||--o{ entity_fields : "tiene"
    entities ||--o{ entity_relations : "origen"
    entities ||--o{ entity_relations : "destino"
    entities ||--o{ entity_views : "tiene"
    entities ||--o{ entity_data : "tiene registros"
    entity_fields ||--o{ field_validations : "tiene"
    entity_relations ||--o{ entity_relations_data : "relaciona"
    entity_data ||--o{ entity_data_versions : "versiona"
    entity_data ||--o{ audit_log : "audita"
    entities ||--o{ user_permissions : "permite"
    entities ||--o{ role_entity_permissions : "permite"
    
    entities {
        uuid id PK
        string name UK
        string display_name
        string table_name UK
        timestamp created_at
    }
    
    entity_fields {
        uuid id PK
        uuid entity_id FK
        string name
        string field_type
        boolean is_required
    }
    
    entity_data {
        uuid id PK
        uuid entity_id FK
        timestamp created_at
        timestamp deleted_at
        integer version
    }
    
    audit_log {
        uuid id PK
        uuid user_id
        uuid entity_id FK
        uuid record_id
        string action_type
        jsonb old_values
        jsonb new_values
    }
```

## 6. Diagrama de Flujo - Proceso de Rollback

```mermaid
flowchart TD
    Start([Admin solicita rollback]) --> LoadAudit[Cargar audit_log]
    LoadAudit --> SelectChange[Seleccionar cambio a revertir]
    SelectChange --> GetVersion[Obtener versión anterior]
    GetVersion --> CheckVersion{¿Versión existe?}
    CheckVersion -->|No| Error[Error: Versión no encontrada]
    CheckVersion -->|Sí| LoadSnapshot[Cargar snapshot de versión]
    LoadSnapshot --> Validate[Validar datos de versión]
    Validate --> Confirm{¿Confirmar rollback?}
    Confirm -->|No| Cancel[Cancelar operación]
    Confirm -->|Sí| ExecuteRollback[Ejecutar rollback]
    ExecuteRollback --> UpdateRecord[Actualizar registro con datos anteriores]
    UpdateRecord --> CreateNewVersion[Crear nueva versión con datos restaurados]
    CreateNewVersion --> LogRollback[Registrar en audit_log tipo ROLLBACK]
    LogRollback --> Success[Rollback completado]
    Success --> Notify[Notificar al usuario]
    Error --> Notify
    Cancel --> Notify
```

## 7. Diagrama de Componentes - Frontend Detallado

```mermaid
graph TB
    subgraph "Pages"
        LoginPage[Login Page]
        DashboardPage[Dashboard Page]
        AdminPage[Admin Page]
        EntityListPage[Entity List Page]
        ReportsPage[Reports Page]
    end
    
    subgraph "Admin Components"
        EntityBuilder[EntityBuilder]
        FieldConfig[FieldConfig]
        RelationConfig[RelationConfig]
        ViewConfig[ViewConfig]
    end
    
    subgraph "CRUD Components"
        DynamicList[DynamicList]
        DynamicForm[DynamicForm]
        DynamicTable[DynamicTable]
        DynamicFilters[DynamicFilters]
        RecordDetail[RecordDetail]
    end
    
    subgraph "Reports Components"
        ReportsDashboard[ReportsDashboard]
        ErrorReports[ErrorReports]
        StatisticsView[StatisticsView]
        MetricsView[MetricsView]
    end
    
    subgraph "Common Components"
        Button[Button]
        Input[Input]
        Select[Select]
        Modal[Modal]
        LoadingSpinner[LoadingSpinner]
    end
    
    subgraph "Hooks"
        useMetadata[useMetadata]
        useDynamicEntity[useDynamicEntity]
        useAuth[useAuth]
        useAudit[useAudit]
    end
    
    subgraph "Services"
        ApiService[API Service]
        MetadataService[Metadata Service]
        AuthService[Auth Service]
    end
    
    LoginPage --> AuthService
    DashboardPage --> EntityListPage
    DashboardPage --> ReportsPage
    AdminPage --> EntityBuilder
    EntityListPage --> DynamicList
    
    EntityBuilder --> FieldConfig
    EntityBuilder --> RelationConfig
    EntityBuilder --> ViewConfig
    EntityBuilder --> MetadataService
    
    DynamicList --> DynamicTable
    DynamicList --> DynamicFilters
    DynamicList --> DynamicForm
    DynamicList --> useDynamicEntity
    
    DynamicForm --> useMetadata
    DynamicForm --> ApiService
    
    ReportsDashboard --> ErrorReports
    ReportsDashboard --> StatisticsView
    ReportsDashboard --> MetricsView
    
    useMetadata --> MetadataService
    useDynamicEntity --> ApiService
    useAuth --> AuthService
    
    MetadataService --> ApiService
    AuthService --> ApiService
```

## 8. Diagrama de Flujo - Validación de Datos

```mermaid
flowchart TD
    Start([Datos recibidos]) --> LoadMeta[Cargar metadatos de entidad]
    LoadMeta --> IterateFields[Iterar sobre campos definidos]
    IterateFields --> CheckRequired{¿Campo requerido?}
    CheckRequired -->|Sí| CheckValue{¿Valor presente?}
    CheckValue -->|No| ErrorRequired[Error: Campo requerido]
    CheckValue -->|Sí| CheckType
    CheckRequired -->|No| CheckType{¿Valor presente?}
    CheckType -->|No| NextField[Siguiente campo]
    CheckType -->|Sí| ValidateType[Validar tipo de dato]
    ValidateType --> TypeValid{¿Tipo válido?}
    TypeValid -->|No| ErrorType[Error: Tipo inválido]
    TypeValid -->|Sí| CheckValidations{¿Tiene validaciones?}
    CheckValidations -->|No| NextField
    CheckValidations -->|Sí| ValidateRules[Validar reglas personalizadas]
    ValidateRules --> RulesValid{¿Reglas válidas?}
    RulesValid -->|No| ErrorRules[Error: Regla no cumplida]
    RulesValid -->|Sí| NextField
    NextField --> MoreFields{¿Más campos?}
    MoreFields -->|Sí| IterateFields
    MoreFields -->|No| CheckUnique{¿Validar unicidad?}
    CheckUnique -->|Sí| CheckDB[Consultar BD por duplicados]
    CheckDB --> IsUnique{¿Es único?}
    IsUnique -->|No| ErrorUnique[Error: Valor duplicado]
    IsUnique -->|Sí| Success[Validación exitosa]
    CheckUnique -->|No| Success
    ErrorRequired --> End([Retornar errores])
    ErrorType --> End
    ErrorRules --> End
    ErrorUnique --> End
    Success --> End
```

Estos diagramas complementan la documentación principal y ayudan a visualizar mejor los diferentes aspectos del sistema.


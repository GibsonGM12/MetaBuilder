-- ============================================
-- ESQUEMA DE BASE DE DATOS
-- Sistema Low-Code Platform
-- ============================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLAS DE METADATOS
-- ============================================

-- Tabla de entidades
CREATE TABLE entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(200) NOT NULL,
    description TEXT,
    table_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX idx_entities_name ON entities(name);
CREATE INDEX idx_entities_is_active ON entities(is_active);

-- Tabla de campos de entidades
CREATE TABLE entity_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    display_name VARCHAR(200) NOT NULL,
    field_type VARCHAR(50) NOT NULL,
    max_length INTEGER,
    is_required BOOLEAN NOT NULL DEFAULT false,
    is_unique BOOLEAN NOT NULL DEFAULT false,
    default_value TEXT,
    column_name VARCHAR(100) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(entity_id, name),
    UNIQUE(entity_id, column_name)
);

CREATE INDEX idx_entity_fields_entity_id ON entity_fields(entity_id);
CREATE INDEX idx_entity_fields_display_order ON entity_fields(entity_id, display_order);

-- Tabla de validaciones de campos
CREATE TABLE field_validations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    field_id UUID NOT NULL REFERENCES entity_fields(id) ON DELETE CASCADE,
    validation_type VARCHAR(50) NOT NULL,
    validation_rule TEXT NOT NULL,
    error_message VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_field_validations_field_id ON field_validations(field_id);

-- Tabla de relaciones entre entidades
CREATE TABLE entity_relations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    target_entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    relation_type VARCHAR(20) NOT NULL CHECK (relation_type IN ('ONE_TO_ONE', 'ONE_TO_MANY', 'MANY_TO_MANY')),
    source_field_id UUID REFERENCES entity_fields(id),
    target_field_id UUID REFERENCES entity_fields(id),
    relation_name VARCHAR(100) NOT NULL,
    cascade_delete BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_entity_relations_source ON entity_relations(source_entity_id);
CREATE INDEX idx_entity_relations_target ON entity_relations(target_entity_id);

-- Tabla de vistas (configuración de listados y formularios)
CREATE TABLE entity_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    view_type VARCHAR(50) NOT NULL CHECK (view_type IN ('LIST', 'FORM', 'DETAIL')),
    view_name VARCHAR(100) NOT NULL,
    configuration JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(entity_id, view_type, view_name)
);

CREATE INDEX idx_entity_views_entity_id ON entity_views(entity_id);
CREATE INDEX idx_entity_views_type ON entity_views(entity_id, view_type);

-- ============================================
-- TABLAS DE DATOS DINÁMICOS
-- ============================================

-- Tabla genérica de metadatos de registros
CREATE TABLE entity_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    version INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX idx_entity_data_entity_id ON entity_data(entity_id);
CREATE INDEX idx_entity_data_deleted_at ON entity_data(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_entity_data_created_by ON entity_data(created_by);
CREATE INDEX idx_entity_data_updated_at ON entity_data(updated_at);

-- Tabla genérica para relaciones N-N
CREATE TABLE entity_relations_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    relation_id UUID NOT NULL REFERENCES entity_relations(id) ON DELETE CASCADE,
    source_record_id UUID NOT NULL,
    target_record_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(relation_id, source_record_id, target_record_id)
);

CREATE INDEX idx_entity_relations_data_relation ON entity_relations_data(relation_id);
CREATE INDEX idx_entity_relations_data_source ON entity_relations_data(source_record_id);
CREATE INDEX idx_entity_relations_data_target ON entity_relations_data(target_record_id);

-- ============================================
-- TABLAS DE AUDITORÍA
-- ============================================

-- Bitácora de operaciones
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    entity_id UUID REFERENCES entities(id),
    record_id UUID,
    action_type VARCHAR(20) NOT NULL CHECK (action_type IN ('CREATE', 'UPDATE', 'DELETE', 'ROLLBACK')),
    old_values JSONB,
    new_values JSONB,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT
);

CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_entity_id ON audit_log(entity_id);
CREATE INDEX idx_audit_log_record_id ON audit_log(record_id);
CREATE INDEX idx_audit_log_timestamp ON audit_log(timestamp DESC);
CREATE INDEX idx_audit_log_action_type ON audit_log(action_type);

-- Versiones históricas de registros
CREATE TABLE entity_data_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_id UUID NOT NULL,
    entity_id UUID NOT NULL REFERENCES entities(id),
    version INTEGER NOT NULL,
    data_snapshot JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    UNIQUE(record_id, version)
);

CREATE INDEX idx_entity_data_versions_record ON entity_data_versions(record_id);
CREATE INDEX idx_entity_data_versions_entity ON entity_data_versions(entity_id);
CREATE INDEX idx_entity_data_versions_created_at ON entity_data_versions(created_at DESC);

-- ============================================
-- TABLAS DE LOGS Y ERRORES
-- ============================================

-- Logs de errores de la aplicación
CREATE TABLE error_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    error_type VARCHAR(50) NOT NULL,
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    entity_id UUID REFERENCES entities(id),
    record_id UUID,
    user_id UUID,
    request_path VARCHAR(500),
    request_method VARCHAR(10),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_error_logs_timestamp ON error_logs(timestamp DESC);
CREATE INDEX idx_error_logs_error_type ON error_logs(error_type);
CREATE INDEX idx_error_logs_resolved ON error_logs(resolved);
CREATE INDEX idx_error_logs_entity_id ON error_logs(entity_id);

-- ============================================
-- TABLAS DE AUTENTICACIÓN Y PERMISOS
-- ============================================

-- Permisos de usuarios sobre entidades (cache local)
CREATE TABLE user_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    permission_type VARCHAR(20) NOT NULL CHECK (permission_type IN ('CREATE', 'READ', 'UPDATE', 'DELETE', 'ADMIN')),
    granted BOOLEAN NOT NULL DEFAULT true,
    granted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    granted_by UUID,
    UNIQUE(user_id, entity_id, permission_type)
);

CREATE INDEX idx_user_permissions_user_id ON user_permissions(user_id);
CREATE INDEX idx_user_permissions_entity_id ON user_permissions(entity_id);

-- Permisos por rol sobre entidades
CREATE TABLE role_entity_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_name VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    permission_type VARCHAR(20) NOT NULL CHECK (permission_type IN ('CREATE', 'READ', 'UPDATE', 'DELETE', 'ADMIN')),
    granted BOOLEAN NOT NULL DEFAULT true,
    UNIQUE(role_name, entity_id, permission_type)
);

CREATE INDEX idx_role_entity_permissions_role ON role_entity_permissions(role_name);
CREATE INDEX idx_role_entity_permissions_entity ON role_entity_permissions(entity_id);

-- ============================================
-- TABLAS DE MÉTRICAS
-- ============================================

-- Métricas del sistema
CREATE TABLE system_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_type VARCHAR(50) NOT NULL,
    metric_value DECIMAL(10,2) NOT NULL,
    entity_id UUID REFERENCES entities(id),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

CREATE INDEX idx_system_metrics_type ON system_metrics(metric_type);
CREATE INDEX idx_system_metrics_timestamp ON system_metrics(timestamp DESC);
CREATE INDEX idx_system_metrics_entity_id ON system_metrics(entity_id);

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para entities
CREATE TRIGGER update_entities_updated_at BEFORE UPDATE ON entities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para entity_views
CREATE TRIGGER update_entity_views_updated_at BEFORE UPDATE ON entity_views
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DATOS INICIALES (OPCIONAL)
-- ============================================

-- Insertar entidad de sistema para usuarios (si se requiere)
-- Esta entidad puede ser creada dinámicamente, pero se puede pre-configurar

-- ============================================
-- COMENTARIOS
-- ============================================

COMMENT ON TABLE entities IS 'Define las entidades del sistema configuradas dinámicamente';
COMMENT ON TABLE entity_fields IS 'Define los campos de cada entidad';
COMMENT ON TABLE entity_data IS 'Metadatos de cada registro de cualquier entidad';
COMMENT ON TABLE audit_log IS 'Bitácora de todas las operaciones realizadas en el sistema';
COMMENT ON TABLE entity_data_versions IS 'Versiones históricas de registros para soporte de rollback';


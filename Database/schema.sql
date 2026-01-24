-- ============================================
-- ESQUEMA DE BASE DE DATOS - MVP
-- MetaBuilder - Sistema Low-Code Platform
-- Versión: 1.0 (MVP)
-- Fecha: Enero 2026
-- ============================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABLA DE USUARIOS
-- ============================================

-- Almacena usuarios del sistema para autenticación JWT
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(200) NOT NULL,
    password_hash VARCHAR(500) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('Admin', 'User')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

COMMENT ON TABLE users IS 'Usuarios del sistema para autenticación JWT';
COMMENT ON COLUMN users.username IS 'Nombre de usuario único para login';
COMMENT ON COLUMN users.password_hash IS 'Hash bcrypt del password';
COMMENT ON COLUMN users.role IS 'Rol: Admin (gestiona metadatos + datos) o User (solo datos)';

-- ============================================
-- TABLAS DE METADATOS
-- ============================================

-- Define las entidades de negocio creadas dinámicamente
CREATE TABLE entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(200) NOT NULL,
    description TEXT,
    table_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_entities_name ON entities(name);

COMMENT ON TABLE entities IS 'Definición de entidades de negocio dinámicas';
COMMENT ON COLUMN entities.name IS 'Nombre interno único (snake_case)';
COMMENT ON COLUMN entities.display_name IS 'Nombre para mostrar en UI';
COMMENT ON COLUMN entities.table_name IS 'Nombre de tabla física (entity_{uuid})';

-- Define los campos de cada entidad
CREATE TABLE entity_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    display_name VARCHAR(200) NOT NULL,
    field_type VARCHAR(50) NOT NULL CHECK (field_type IN ('TEXT', 'NUMBER', 'INTEGER', 'DATE', 'BOOLEAN')),
    is_required BOOLEAN NOT NULL DEFAULT false,
    max_length INTEGER,
    column_name VARCHAR(100) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(entity_id, name),
    UNIQUE(entity_id, column_name)
);

CREATE INDEX idx_entity_fields_entity_id ON entity_fields(entity_id);
CREATE INDEX idx_entity_fields_display_order ON entity_fields(entity_id, display_order);

COMMENT ON TABLE entity_fields IS 'Campos de cada entidad con tipo y configuración';
COMMENT ON COLUMN entity_fields.field_type IS 'Tipo: TEXT, NUMBER, INTEGER, DATE, BOOLEAN';
COMMENT ON COLUMN entity_fields.is_required IS 'Si el campo es obligatorio';
COMMENT ON COLUMN entity_fields.max_length IS 'Longitud máxima (solo para TEXT)';
COMMENT ON COLUMN entity_fields.column_name IS 'Nombre de columna en tabla física';

-- ============================================
-- DATOS INICIALES (SEEDS)
-- ============================================

-- Usuario administrador por defecto
-- Password: Admin123! (hash bcrypt)
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@metabuilder.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4eVLPGtXgFJzPbVK', 'Admin');

-- Usuario normal por defecto
-- Password: User123! (hash bcrypt)
INSERT INTO users (username, email, password_hash, role) VALUES
('user', 'user@metabuilder.com', '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'User');

-- ============================================
-- EJEMPLO: Entidad Productos (para demo)
-- ============================================

-- Crear entidad Productos
INSERT INTO entities (id, name, display_name, description, table_name) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'productos', 'Productos', 'Catálogo de productos de la empresa', 'entity_a1b2c3d4e5f6');

-- Campos de la entidad Productos
INSERT INTO entity_fields (entity_id, name, display_name, field_type, is_required, max_length, column_name, display_order) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'nombre', 'Nombre', 'TEXT', true, 200, 'nombre', 1),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'descripcion', 'Descripción', 'TEXT', false, null, 'descripcion', 2),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'precio', 'Precio', 'NUMBER', true, null, 'precio', 3),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'stock', 'Stock', 'INTEGER', false, null, 'stock', 4),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'activo', 'Activo', 'BOOLEAN', false, null, 'activo', 5);

-- Crear tabla física para Productos
CREATE TABLE entity_a1b2c3d4e5f6 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INTEGER,
    activo BOOLEAN DEFAULT true
);

-- Datos de ejemplo para Productos
INSERT INTO entity_a1b2c3d4e5f6 (nombre, descripcion, precio, stock, activo) VALUES
('Laptop Dell XPS 15', 'Laptop de alta gama con procesador Intel i7', 1299.99, 25, true),
('Monitor LG 27"', 'Monitor 4K UHD con panel IPS', 449.99, 50, true),
('Teclado Mecánico', 'Teclado mecánico RGB switches Cherry MX', 129.99, 100, true),
('Mouse Logitech MX', 'Mouse ergonómico inalámbrico', 79.99, 75, true),
('Webcam HD 1080p', 'Cámara web para videoconferencias', 89.99, 30, false);

-- ============================================
-- EJEMPLO: Entidad Clientes (para demo)
-- ============================================

-- Crear entidad Clientes
INSERT INTO entities (id, name, display_name, description, table_name) VALUES
('b2c3d4e5-f6a7-8901-bcde-f23456789012', 'clientes', 'Clientes', 'Registro de clientes', 'entity_b2c3d4e5f6a7');

-- Campos de la entidad Clientes
INSERT INTO entity_fields (entity_id, name, display_name, field_type, is_required, max_length, column_name, display_order) VALUES
('b2c3d4e5-f6a7-8901-bcde-f23456789012', 'nombre_completo', 'Nombre Completo', 'TEXT', true, 200, 'nombre_completo', 1),
('b2c3d4e5-f6a7-8901-bcde-f23456789012', 'email', 'Correo Electrónico', 'TEXT', true, 200, 'email', 2),
('b2c3d4e5-f6a7-8901-bcde-f23456789012', 'telefono', 'Teléfono', 'TEXT', false, 20, 'telefono', 3),
('b2c3d4e5-f6a7-8901-bcde-f23456789012', 'fecha_registro', 'Fecha de Registro', 'DATE', false, null, 'fecha_registro', 4);

-- Crear tabla física para Clientes
CREATE TABLE entity_b2c3d4e5f6a7 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    nombre_completo VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    telefono VARCHAR(20),
    fecha_registro DATE
);

-- Datos de ejemplo para Clientes
INSERT INTO entity_b2c3d4e5f6a7 (nombre_completo, email, telefono, fecha_registro) VALUES
('Juan Pérez', 'juan.perez@email.com', '+52 55 1234 5678', '2026-01-15'),
('María García', 'maria.garcia@email.com', '+52 55 8765 4321', '2026-01-18'),
('Carlos López', 'carlos.lopez@email.com', null, '2026-01-20');

-- ============================================
-- FIN DEL SCHEMA MVP
-- ============================================

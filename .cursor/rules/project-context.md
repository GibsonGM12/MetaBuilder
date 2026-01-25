# 📋 MetaBuilder - Contexto del Proyecto

> **Última actualización**: 24 de Enero 2026

## Visión del Proyecto

**MetaBuilder** es una plataforma low-code basada en metadatos que permite:

- Definir entidades de negocio dinámicamente sin modificar código
- Realizar operaciones CRUD sobre esas entidades
- Generar interfaces automáticas para gestionar los datos

## Problema que Resuelve

- Elimina la necesidad de crear tablas y endpoints manualmente para cada entidad
- Reduce el tiempo de desarrollo para sistemas CRUD básicos
- Permite a usuarios no técnicos (Admin) configurar el sistema

## Características Principales (MVP)

### 1. Gestión de Metadatos (Admin)
- Crear/editar/eliminar entidades con nombre, display_name y descripción
- Agregar campos a entidades con tipos: TEXT, NUMBER, INTEGER, DATE, BOOLEAN
- Configuración de campos: nombre, display_name, is_required, max_length
- Creación automática de tablas dinámicas (`entity_{guid}`)

### 2. CRUD Genérico de Datos
- Crear, listar, obtener, actualizar y eliminar registros
- Motor de queries dinámicas basado en metadatos
- Validación automática de tipos y campos requeridos
- Paginación incluida

### 3. Autenticación y Autorización
- Registro de usuarios y login con JWT
- Dos roles: Admin (gestiona todo) y User (solo datos)
- Middleware de autenticación JWT simple (sin Keycloak en MVP)

### 4. Frontend
- Pantalla de login con almacenamiento de token
- Admin de entidades (solo Admin)
- CRUD dinámico (Admin y User)
- Formularios generados dinámicamente según metadatos

## Funcionalidades Futuras (Post-MVP)

- [ ] Sistema de auditoría completo
- [ ] Rollback/Versionado de cambios
- [ ] Reportes y métricas
- [ ] Relaciones entre entidades (FK, 1-N, N-N)
- [ ] Vistas configurables
- [ ] Validaciones avanzadas (regex, custom rules)
- [ ] Soft deletes
- [ ] Filtros avanzados y búsqueda
- [ ] Keycloak para autenticación avanzada

## Alcance del MVP

- **Tiempo estimado**: ~30 horas de desarrollo
- **Tickets totales**: 59 tickets distribuidos en 7 épicas
- **Objetivo**: Sistema funcional con las 4 características principales

## Documentación de Referencia

| Documento | Ruta |
|-----------|------|
| Descripción del producto | `documentation/2-descripcion-producto/` |
| Arquitectura | `documentation/3-arquitectura/` |
| Modelo de datos | `documentation/4-modelo-datos/` |
| API Specification | `documentation/5-especificacion-api/` |
| Historias de usuario | `documentation/6-historias-usuario/` |
| Tickets de trabajo | `documentation/7-tickets-trabajo/` |

---

> **Actualizar este archivo cuando**: Cambie la visión del proyecto, se agreguen nuevas características al MVP, o se definan nuevas funcionalidades futuras.

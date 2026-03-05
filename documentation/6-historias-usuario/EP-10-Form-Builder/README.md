# EP-10: Form Builder

## Descripción

Épica que implementa un sistema completo de formularios personalizados donde los administradores pueden diseñar formularios complejos con múltiples secciones (campos simples, lookups, tablas detalle, campos calculados) que abarcan múltiples entidades relacionadas. Los usuarios pueden llenar y enviar estos formularios, creando registros en todas las entidades relacionadas dentro de una transacción.

## Historias de Usuario

| ID | Título | Prioridad | Estimación |
|------|--------|-----------|------------|
| US-060 | Crear formulario personalizado | P0 | 60 min |
| US-061 | Agregar sección de campos simples | P0 | 45 min |
| US-062 | Agregar sección lookup | P0 | 60 min |
| US-063 | Agregar sección master-detail | P0 | 90 min |
| US-064 | Agregar campo calculado | P1 | 45 min |
| US-065 | Diseñar layout del formulario | P0 | 60 min |
| US-066 | Llenar y enviar formulario | P0 | 75 min |
| US-067 | Listar formularios disponibles | P0 | 30 min |
| US-068 | Editar y eliminar formulario | P1 | 30 min |
| US-069 | Ver registros creados desde formulario | P1 | 30 min |

## Dependencias

- EP-03: Gestión de Metadatos (entidades y campos)
- EP-04: Motor CRUD Dinámico (datos de entidades)
- EP-05: Frontend Admin (layout, navegación)
- EP-09: Relaciones entre Entidades (RelationLookup component)

## Estimación Total

~18-22 horas de desarrollo

---

*Última actualización: Marzo 2026*

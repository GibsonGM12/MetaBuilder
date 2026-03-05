# Relaciones entre Entidades - Wireframes

> **Última actualización**: Marzo 2026

## Pantalla 1: Field Manager con tipo RELATION seleccionado

Aparece cuando el Admin agrega un campo y selecciona tipo RELATION. Muestra los controles adicionales: entidad destino y campo de visualización.

```
+--[ Sidebar ]--+--[ Contenido Principal ]-------------------------------------+
|               |                                                               |
| MetaBuilder   |  Entidad: Órdenes                    [Guardar] [Cancelar]    |
|               |                                                               |
| [★] Inicio    |  ┌───────────────────────────────────────────────────────┐   |
| [□] Dashboards|  │  AGREGAR CAMPO                                        │   |
| [≡] Datos     |  │                                                       │   |
| [◉] Entidades |  │  Nombre del campo                                     │   |
|   (admin)     |  │  [cliente________________________]                    │   |
|               |  │                                                       │   |
| [✎] Designer  |  │  Tipo de campo                                       │   |
|   (admin)     |  │  [▼ RELATION                    ]  ◄── seleccionado   │   |
|               |  │                                                       │   |
|               |  │  ─── Opciones para RELATION ───                        │   |
|               |  │                                                       │   |
|               |  │  Entidad destino                                      │   |
|               |  │  [▼ Clientes                    ]  ◄── dropdown       │   |
|               |  │     • Productos                                       │   |
|               |  │     • Clientes          ✓                             │   |
|               |  │     • Categorías                                       │   |
|               |  │     • Órdenes (oculta - misma entidad)                 │   |
|               |  │                                                       │   |
|               |  │  Campo de visualización                               │   |
|               |  │  [▼ nombre                     ]  ◄── dropdown         │   |
|               |  │     • nombre              ✓                            │   |
|               |  │     • email                                             │   |
|               |  │     • telefono                                         │   |
|               |  │     • created_at                                       │   |
|               |  │                                                       │   |
|               |  │  Requerido  [☐]                                       │   |
|               |  │                                                       │   |
|               |  └───────────────────────────────────────────────────────┘   |
|               |                                                               |
+---------------+---------------------------------------------------------------+
```

### Elementos:
- **Tipo RELATION**: aparece en el dropdown junto a TEXT, NUMBER, DATE, BOOLEAN, etc.
- **Entidad destino**: dropdown con todas las entidades (excluyendo la actual)
- **Campo de visualización**: dropdown con campos de la entidad destino seleccionada (texto preferible para mostrar en lookup)
- Al guardar: crea relación, ALTER TABLE ADD COLUMN UUID

---

## Pantalla 2: DynamicForm con campo RELATION como autocomplete

Formulario CRUD dinámico mostrando un campo RELATION renderizado como dropdown/autocomplete con búsqueda.

```
+--[ Sidebar ]--+--[ Contenido Principal ]-------------------------------------+
|               |                                                               |
|               |  Nueva Orden                                    [Guardar]    |
|               |                                                               |
|               |  ┌───────────────────────────────────────────────────────┐   |
|               |  │                                                       │   |
|               |  │  Fecha                                                 │   |
|               |  │  [2026-03-01________________]                         │   |
|               |  │                                                       │   |
|               |  │  Cliente *                                              │   |
|               |  │  [Mar________________________]  🔍  ◄── autocomplete   │   |
|               |  │  ┌─────────────────────────────────────────────────┐   │   |
|               |  │  │ María García                                    │   │   │
|               |  │  │ Marcos López                                    │   │   │
|               |  │  │ Marta Sánchez                                   │   │   │
|               |  │  │ Martín Ruiz                                     │   │   │
|               |  │  └─────────────────────────────────────────────────┘   │   │
|               |  │  (resultados de GET /entities/{id}/lookup?search=Mar)    │   │
|               |  │                                                       │   |
|               |  │  Total                                               │   |
|               |  │  [_________________________]                         │   |
|               |  │                                                       │   |
|               |  │  Estado                                               │   |
|               |  │  [▼ Pendiente                 ]                      │   |
|               |  │                                                       │   |
|               |  └───────────────────────────────────────────────────────┘   |
|               |                                                               |
+---------------+---------------------------------------------------------------+
```

### Elementos:
- **Campo Cliente**: tipo RELATION renderizado como autocomplete/dropdown
- Usuario escribe → debounce → GET /lookup?search=term
- Dropdown muestra `display_value` (ej: nombre) de cada registro
- Al seleccionar: se guarda el UUID internamente
- Placeholder: "Buscar cliente..." o "Seleccionar cliente"
- Opción vacía si el campo no es requerido

---

## Pantalla 3: Entity Detail con sección Relaciones

Página de detalle de entidad mostrando la sección/tab de relaciones definidas.

```
+--[ Sidebar ]--+--[ Contenido Principal ]-------------------------------------+
|               |                                                               |
|               |  Órdenes                          [Editar] [Agregar campo]   |
|               |                                                               |
|               |  ┌─────────────┬─────────────┬─────────────┐                  |
|               |  │  General    │  Campos     │ Relaciones  │  ◄── tab        |
|               |  └─────────────┴─────────────┴─────────────┘                  |
|               |                                                               |
|               |  ┌───────────────────────────────────────────────────────┐   |
|               |  │  RELACIONES DE ESTA ENTIDAD                           │   |
|               |  │                                                       │   |
|               |  │  Esta entidad participa en las siguientes relaciones:  │   |
|               |  │                                                       │   |
|               |  │  ┌─────────────────────────────────────────────────┐ │   |
|               |  │  │ Campo    │ Entidad destino │ Tipo      │ Acción │ │   |
|               |  │  ├──────────┼─────────────────┼───────────┼────────┤ │   |
|               |  │  │ cliente  │ Clientes        │ MANY_TO_ONE│  🗑   │ │   |
|               |  │  │ vendedor │ Usuarios        │ MANY_TO_ONE│  🗑   │ │   |
|               |  │  └─────────────────────────────────────────────────┘ │   |
|               |  │                                                       │   |
|               |  │  Entidades que referencian a Órdenes:                  │   |
|               |  │  (ninguna)                                            │   |
|               |  │                                                       │   |
|               |  │  [+ Agregar relación]  (opcional - lleva a Add Field) │   |
|               |  │                                                       │   |
|               |  └───────────────────────────────────────────────────────┘   |
|               |                                                               |
+---------------+---------------------------------------------------------------+
```

### Elementos:
- **Tab Relaciones**: junto a General y Campos en el detalle de entidad
- **Tabla de relaciones como source**: campo, entidad destino, tipo, botón eliminar
- **Relaciones inversas**: "Entidades que referencian a X" (cuando esta entidad es target)
- **Botón Eliminar (🗑)**: abre modal de confirmación
- **Empty state**: "No hay relaciones definidas" si la lista está vacía
- **Agregar relación**: enlace opcional que navega a Add Field con RELATION preseleccionado

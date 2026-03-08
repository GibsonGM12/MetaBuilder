# Form Builder - Wireframes

> **Última actualización**: Marzo 2026

## Pantalla 1: Form Designer (`/admin/forms/:id/edit`)

Solo accesible por Admin. Canvas con secciones arrastrables + palette de secciones + panel de configuración.

```
+--[ Sidebar ]--+--[ Canvas ]-----------------------------+--[ Panel ]--------+
|               |                                          |                   |
|               |  ┌────────────────────────────────────┐  |  SECTION PALETTE  |
|               |  │ Nombre: [Captura de Venta______]   │  |                   |
|               |  │ Entidad: [▼ Ventas            ]    │  |  ┌─────────────┐ |
|               |  │ [Guardar] [Preview] [Descartar]    │  |  │ [+] FIELDS  │ |
|               |  └────────────────────────────────────┘  |  │   (campos   │ |
|               |                                          |  │   simples)  │ |
|               |  Secciones (arrastrar para reordenar)    |  ├─────────────┤ |
|               |                                          |  │ [+] LOOKUP  │ |
|               |  ┌────────────────────────────────┐     |  │   (selector │ |
|               |  │ ≡ Cabecera (FIELDS) - Ventas   │     |  │   relacion.) │ |
|               |  │   fecha, status, observaciones │     |  ├─────────────┤ |
|               |  └────────────────────────────────┘     |  │ [+] DETAIL  │ |
|               |                                          |  │   _TABLE    │ |
|               |  ┌────────────────────────────────┐     |  │   (tabla    │ |
|               |  │ ≡ Cliente (LOOKUP) -> Clientes  │     |  │   editable) │ |
|               |  └────────────────────────────────┘     |  ├─────────────┤ |
|               |                                          |  │ [+] CALC    │ |
|               |  ┌────────────────────────────────┐     |  │   ULATED    │ |
|               |  │ ≡ Detalle (DETAIL_TABLE)       │     |  │   (fórmulas)│ |
|               |  │   DetalleVenta: producto, cant │     |  └─────────────┘ |
|               |  └────────────────────────────────┘     |                   |
|               |                                          |  ──────────────── |
|               |  ┌────────────────────────────────┐     |                   |
|               |  │ ≡ Totales (CALCULATED)         │     |  SECTION CONFIG   |
|               |  │   SUM(detalle.subtotal)        │     |  (al seleccionar  |
|               |  └────────────────────────────────┘     |   una sección)    |
|               |                                          |                   |
|               |  ≡ = handle de arrastre                  |  Ver Pantalla 3   |
|               |                                          |                   |
+---------------+------------------------------------------+-------------------+
```

### Elementos:
- **Toolbar superior**: Nombre del formulario, entidad principal, botones Guardar/Preview/Descartar
- **Canvas central**: Lista de secciones con handle de arrastre (≡), cada una muestra tipo y resumen de config
- **Panel derecho** (~300px):
  - **Section Palette**: Tipos de sección para agregar (FIELDS, LOOKUP, DETAIL_TABLE, CALCULATED)
  - **Section Config**: Aparece al seleccionar una sección, con opciones según el tipo

---

## Pantalla 2: Section Config Panel (detalle)

Aparece en el panel derecho del Form Designer cuando se selecciona una sección.

### 2a. Config para FIELDS

```
┌─────────────────────────────────┐
│  Configuración: Cabecera        │
│                                 │
│  Tipo: FIELDS                   │
│                                 │
│  Entidad                        │
│  [▼ Ventas                 ]    │
│                                 │
│  Campos a incluir               │
│  [☑] fecha                      │
│  [☑] status                     │
│  [☑] observaciones               │
│  [☐] total (calculado)          │
│                                 │
│  Título de sección              │
│  [Cabecera________________]      │
│                                 │
│  [🗑 Eliminar sección]          │
└─────────────────────────────────┘
```

### 2b. Config para LOOKUP

```
┌─────────────────────────────────┐
│  Configuración: Cliente          │
│                                 │
│  Tipo: LOOKUP                   │
│                                 │
│  Entidad destino                │
│  [▼ Clientes               ]    │
│                                 │
│  Relación                       │
│  [▼ Ventas -> Clientes     ]    │
│                                 │
│  Campo de visualización         │
│  [▼ nombre                 ]    │
│                                 │
│  Requerido                      │
│  [☑] Sí                         │
│                                 │
│  [🗑 Eliminar sección]          │
└─────────────────────────────────┘
```

### 2c. Config para DETAIL_TABLE

```
┌─────────────────────────────────┐
│  Configuración: Detalle         │
│                                 │
│  Tipo: DETAIL_TABLE             │
│                                 │
│  Entidad detalle                │
│  [▼ DetalleVenta           ]    │
│                                 │
│  Relación 1:N                   │
│  [▼ Ventas -> DetalleVenta ]    │
│                                 │
│  Campos de cada fila            │
│  [☑] producto (lookup)           │
│  [☑] cantidad                   │
│  [☑] precio                     │
│  [☑] subtotal (calculado)       │
│                                 │
│  [🗑 Eliminar sección]          │
└─────────────────────────────────┘
```

### 2d. Config para CALCULATED

```
┌─────────────────────────────────┐
│  Configuración: Totales         │
│                                 │
│  Tipo: CALCULATED               │
│                                 │
│  Fórmula                        │
│  [▼ SUM(detalle.subtotal)  ]    │
│     Opciones: SUM, COUNT        │
│                                 │
│  Etiqueta                       │
│  [Total___________________]     │
│                                 │
│  Campo destino (opcional)       │
│  [▼ total en Ventas       ]     │
│                                 │
│  [🗑 Eliminar sección]          │
└─────────────────────────────────┘
```

---

## Pantalla 3: Form Renderer (`/forms/:id`)

Formulario completo para que el usuario lo llene. Accesible por todos los usuarios autenticados.

```
+-- Formulario: "Captura de Venta" ---------------------------------------------+
|                                                                              |
| SECCIÓN: Cabecera (entidad: Ventas)                                          |
|                                                                              |
| Fecha          Status           Observaciones                                |
| [2026-03-01]   [▼ Pendiente  ]   [________________________________]           |
|                                                                              |
| SECCIÓN: Cliente (lookup -> Clientes)                                         |
|                                                                              |
| Cliente                                                                      |
| [Buscar cliente...                    ▼]                                    |
|                                                                              |
| SECCIÓN: Detalle (1:N -> DetalleVenta)                                        |
|                                                                              |
| | Producto (lookup)   | Cantidad | Precio   | Subtotal |      |               |
| |---------------------|---------|----------|----------|------|               |
| | [Buscar producto ▼] | [     ]  | [     ]  | $0.00    | [🗑] |               |
| | [Buscar producto ▼] | [     ]  | [     ]  | $0.00    | [🗑] |               |
| | [+ Agregar línea]                                              |               |
|                                                                              |
| SECCIÓN: Totales                                                             |
|                                                                              |
| Total: [CALC: SUM(detalle.subtotal)]  $0.00                                  |
|                                                                              |
| [Guardar]  [Cancelar]                                                        |
+-----------------------------------------------------------------------------+
```

### Elementos:
- **Header**: Título del formulario
- **Sección Cabecera**: Campos simples (fecha, status, observaciones) de la entidad principal
- **Sección Cliente**: RelationLookup (dropdown con búsqueda) para seleccionar cliente
- **Sección Detalle**: Tabla inline editable
  - Columnas: Producto (lookup), Cantidad, Precio, Subtotal (calculado por fila)
  - Botón "Agregar línea" para nuevas filas
  - Botón eliminar (🗑) por fila
- **Sección Totales**: Campo calculado de solo lectura (SUM de subtotales)
- **Acciones**: Guardar (envía formulario), Cancelar (descartar con confirmación)

---

## Pantalla 4: Lista de Formularios (`/forms`)

Accesible por todos los usuarios. Vista de cards o tabla.

```
+--[ Sidebar ]--+--[ Contenido Principal ]-------------------------------------+
|               |                                                               |
| MetaBuilder   |  Formularios                                                  |
|               |                                                               |
| [★] Inicio    |  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ |
| [□] Formularios  │                 │ │                 │ │                 │ |
| [≡] Datos     |  │ Captura de      │ │ Alta de         │ │ Registro de     │ |
| [◉] Entidades |  │ Venta           │ │ Producto        │ │ Cliente         │ |
|   (admin)     |  │                 │ │                 │ │                 │ |
|               |  │ Formulario para │ │ Formulario de   │ │ Datos básicos   │ |
| [✎] Designer  |  │ ventas con      │ │ alta de         │ │ de clientes     │ |
|   (admin)     |  │ detalle         │ │ productos       │ │                 │ |
|               |  │                 │ │                 │ │                 │ |
|               |  │ Entidad: Ventas │ │ Entidad:        │ │ Entidad:        │ |
|               |  │ [Abrir]         │ │ Productos       │ │ Clientes        │ |
|               |  │                 │ │ [Abrir]         │ │ [Abrir]         │ |
|               |  └─────────────────┘ └─────────────────┘ └─────────────────┘ |
|               |                                                               |
+---------------+---------------------------------------------------------------+
```

### Elementos:
- **Header**: Título "Formularios"
- **Grid de cards**: Cada card muestra nombre, descripción, entidad principal
- **Click en card**: Navega a `/forms/:id` (Form Renderer)
- **Empty state**: "No hay formularios disponibles" + botón crear (si Admin)

---

## Pantalla 5: Form Designer List (`/admin/forms`)

Solo accesible por Admin. Tabla con formularios para gestionar.

```
+--[ Sidebar ]--+--[ Contenido Principal ]-------------------------------------+
|               |                                                               |
|               |  Diseñador de Formularios                  [+ Crear Nuevo]    |
|               |                                                               |
|               |  ┌───────────────────────────────────────────────────────┐   |
|               |  │ Nombre              │ Entidad   │ Secciones │ Acciones │   |
|               |  ├─────────────────────┼───────────┼───────────┼──────────┤   |
|               |  │ Captura de Venta    │ Ventas    │    4      │ ✎  🗑   │   |
|               |  │ Alta de Producto    │ Productos │    1      │ ✎  🗑   │   |
|               |  │ Registro de Cliente │ Clientes  │    1      │ ✎  🗑   │   |
|               |  └───────────────────────────────────────────────────────┘   |
|               |                                                               |
+---------------+---------------------------------------------------------------+
```

### Elementos:
- **Header**: Título + botón "Crear Nuevo"
- **Tabla**: Nombre, entidad principal, cantidad de secciones, acciones (Editar, Eliminar)
- **Editar**: Navega al Form Designer
- **Eliminar**: Modal de confirmación

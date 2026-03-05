# Dashboard Builder - Wireframes

> **Última actualización**: Marzo 2026

## Pantalla 1: Lista de Dashboards (`/dashboards`)

Accesible por todos los usuarios autenticados.

```
+--[ Sidebar ]--+--[ Contenido Principal ]-------------------------------------+
|               |                                                               |
| MetaBuilder   |  Dashboards                            [+ Crear] (solo Admin) |
|               |                                                               |
| [★] Inicio    |  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ |
| [□] Dashboards|  │                 │ │                 │ │                 │ |
| [≡] Datos     |  │  Ventas Q1      │ │  Operaciones   │ │  Inventario    │ |
| [◉] Entidades |  │                 │ │                 │ │                 │ |
|   (admin)     |  │  Panel de ventas │ │  Métricas de   │ │  Control de    │ |
|               |  │  del primer     │ │  operación      │ │  inventario    │ |
| [✎] Designer  |  │  trimestre      │ │  diaria         │ │                 │ |
|   (admin)     |  │                 │ │                 │ │  ┌───────────┐ │ |
|               |  │  ┌───────────┐ │ │  ┌───────────┐ │ │  │ 8 widgets │ │ |
|               |  │  │ 5 widgets │ │ │  │ 3 widgets │ │ │  └───────────┘ │ |
|               |  │  └───────────┘ │ │  └───────────┘ │ │                 │ |
|               |  │  [Por defecto] │ │                 │ │  Hace 5 días   │ |
|               |  │  Hace 2 días   │ │  Hace 3 días   │ │                 │ |
|               |  └─────────────────┘ └─────────────────┘ └─────────────────┘ |
|               |                                                               |
| ─────────     |                                                               |
| usuario       |                                                               |
| [Salir]       |                                                               |
+---------------+---------------------------------------------------------------+
```

### Elementos:
- **Header**: Título "Dashboards" + botón "Crear" (solo Admin)
- **Grid de cards**: 3 columnas desktop, 2 tablet, 1 mobile
- **Cada card contiene**:
  - Nombre del dashboard (h3, bold)
  - Descripción (texto gris, max 2 líneas)
  - Badge "Por defecto" si `is_default=true`
  - Cantidad de widgets
  - Fecha relativa ("Hace 2 días")
- **Click en card**: navega a `/dashboards/:id`
- **Empty state**: "No hay dashboards disponibles" + botón crear (si Admin)

---

## Pantalla 2: Vista de Dashboard (`/dashboards/:id`)

Accesible por todos los usuarios. Los widgets se renderizan en modo estático (no editable).

```
+--[ Sidebar ]--+--[ Contenido Principal ]-------------------------------------+
|               |                                                               |
|               |  [← Volver]  Dashboard: Ventas Q1           [Editar] (Admin) |
|               |                                                               |
|               |  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         |
|               |  │  STAT_CARD   │ │  KPI_CARD    │ │  STAT_CARD   │         |
|               |  │              │ │              │ │              │         |
|               |  │   📦 150     │ │  $45,000     │ │   👤 12      │         |
|               |  │  Productos   │ │  Ventas      │ │  Usuarios    │         |
|               |  │              │ │  totales     │ │              │         |
|               |  └──────────────┘ └──────────────┘ └──────────────┘         |
|               |                                                               |
|               |  ┌────────────────────────┐ ┌──────────────────┐             |
|               |  │      BAR_CHART         │ │    PIE_CHART     │             |
|               |  │                        │ │                  │             |
|               |  │  ██                    │ │     ┌────┐       │             |
|               |  │  ██  ██               │ │    /  A   \      │             |
|               |  │  ██  ██  ██           │ │   | B   C  |     │             |
|               |  │  ██  ██  ██  ██       │ │    \      /      │             |
|               |  │  ──────────────       │ │     └────┘       │             |
|               |  │  Cat1 Cat2 Cat3 Cat4  │ │                  │             |
|               |  └────────────────────────┘ └──────────────────┘             |
|               |                                                               |
|               |  ┌──────────────────────────────────────────────┐             |
|               |  │              DATA_GRID                       │             |
|               |  │                                              │             |
|               |  │  Nombre      │ Precio    │ Categoría        │             |
|               |  │  ────────────┼───────────┼──────────────────│             |
|               |  │  Producto 1  │ $100.00   │ Electrónica      │             |
|               |  │  Producto 2  │ $250.50   │ Hogar            │             |
|               |  │  Producto 3  │ $75.00    │ Electrónica      │             |
|               |  │                                              │             |
|               |  │  ← 1 de 3 →                                 │             |
|               |  └──────────────────────────────────────────────┘             |
|               |                                                               |
+---------------+---------------------------------------------------------------+
```

### Elementos:
- **Header**: Botón volver + nombre del dashboard + botón "Editar" (solo Admin)
- **Grid layout**: react-grid-layout en modo estático
  - `isDraggable: false`
  - `isResizable: false`
- **Cada widget**: renderizado por WidgetRenderer según `widget_type`
- **Loading**: cada widget muestra skeleton independiente
- **Error**: cada widget muestra error independiente (error boundary)

---

## Pantalla 3: Dashboard Designer (`/admin/dashboards/:id/edit`)

Solo accesible por Admin. Canvas editable + panel de configuración.

```
+--[ Sidebar ]--+--[ Canvas ]-----------------------------+--[ Panel ]--------+
|               |                                          |                   |
|               |  ┌────────────────────────────────────┐  |  WIDGET PALETTE   |
|               |  │ Nombre: [Ventas Q1_________]       │  |                   |
|               |  │ [Guardar] [Preview] [Descartar]    │  |  ┌─────────────┐ |
|               |  └────────────────────────────────────┘  |  │ [+] Stat    │ |
|               |                                          |  │     Card    │ |
|               |  ┌──────────┐ ┌──────────┐              |  ├─────────────┤ |
|               |  │ ┊Widget┊ │ │  Widget  │              |  │ [+] KPI     │ |
|               |  │ ┊select┊ │ │          │              |  │     Card    │ |
|               |  │ ┊  ed  ┊ │ │          │              |  ├─────────────┤ |
|               |  └──────────┘ └──────────┘              |  │ [+] Data    │ |
|               |                                          |  │     Grid    │ |
|               |  ┌─────────────────────────┐            |  ├─────────────┤ |
|               |  │        Widget           │            |  │ [+] Bar     │ |
|               |  │                         │            |  │     Chart   │ |
|               |  │                         │            |  ├─────────────┤ |
|               |  └─────────────────────────┘            |  │ [+] Pie     │ |
|               |                                          |  │     Chart   │ |
|               |  Grid: 12 cols, draggable, resizable     |  ├─────────────┤ |
|               |  Líneas de grid visibles como guía       |  │ [+] Line    │ |
|               |                                          |  │     Chart   │ |
|               |                                          |  ├─────────────┤ |
|               |                                          |  │ [+] Recent  │ |
|               |                                          |  │     List    │ |
|               |                                          |  └─────────────┘ |
|               |                                          |                   |
|               |                                          |  ──────────────── |
|               |                                          |                   |
|               |                                          |  CONFIG PANEL     |
|               |                                          |  (aparece al      |
|               |                                          |   seleccionar     |
|               |                                          |   un widget)      |
|               |                                          |                   |
|               |                                          |  Ver Pantalla 4   |
|               |                                          |                   |
+---------------+------------------------------------------+-------------------+
```

### Layout:
- **Sidebar izquierdo**: Navegación estándar de MetaBuilder
- **Canvas central**: Grid interactivo (react-grid-layout)
  - `isDraggable: true`, `isResizable: true`
  - Líneas de grid como guía visual
  - Widgets seleccionables (borde highlight al seleccionar)
- **Panel derecho** (~300px ancho fijo):
  - **Superior**: Widget Palette (lista de tipos para agregar)
  - **Inferior**: Config Panel (configuración del widget seleccionado)
- **Toolbar superior**: Nombre editable, botones de acción

---

## Pantalla 4: Panel de Configuración de Widget

Aparece en el panel derecho del Designer cuando se selecciona un widget.

### 4a. Configuración común (todos los tipos)

```
┌─────────────────────────────────┐
│  Configuración del Widget       │
│                                 │
│  Tipo: Stat Card                │
│                                 │
│  Título                         │
│  [Total de Productos________]   │
│                                 │
│  Entidad                        │
│  [▼ Productos              ]    │
│                                 │
│  ─── Opciones del tipo ───      │
│                                 │
│  (ver secciones 4b-4g)          │
│                                 │
│  ────────────────────────────── │
│                                 │
│  [🗑 Eliminar Widget]           │
│                                 │
└─────────────────────────────────┘
```

### 4b. Opciones: STAT_CARD

```
│  Agregación                     │
│  [▼ Count               ]      │
│                                 │
│  Campo (opcional)               │
│  [▼ -- Ninguno --       ]      │
│                                 │
│  Color                          │
│  [▼ Azul                ]      │
│                                 │
│  Ícono                          │
│  [▼ package             ]      │
```

### 4c. Opciones: KPI_CARD

```
│  Agregación                     │
│  [▼ Sum                 ]      │
│                                 │
│  Campo                          │
│  [▼ precio              ]      │
│                                 │
│  Formato                        │
│  [▼ Moneda              ]      │
│                                 │
│  Etiqueta                       │
│  [Ventas totales del mes___]    │
```

### 4d. Opciones: DATA_GRID

```
│  Columnas a mostrar             │
│  [☑] nombre                     │
│  [☑] precio                     │
│  [☐] descripcion                │
│  [☑] categoria                  │
│                                 │
│  Registros por página           │
│  [▼ 5                   ]      │
│                                 │
│  Ordenar por                    │
│  [▼ created_at          ]      │
│  [▼ Descendente         ]      │
```

### 4e. Opciones: BAR_CHART

```
│  Agrupar por                    │
│  [▼ categoria           ]      │
│                                 │
│  Agregación                     │
│  [▼ Count               ]      │
│                                 │
│  Campo (para sum/avg)           │
│  [▼ -- Ninguno --       ]      │
```

### 4f. Opciones: PIE_CHART

```
│  Agrupar por                    │
│  [▼ estado              ]      │
│                                 │
│  Agregación                     │
│  [▼ Count               ]      │
```

### 4g. Opciones: LINE_CHART

```
│  Eje X (campo fecha)            │
│  [▼ created_at          ]      │
│                                 │
│  Eje Y (campo numérico)        │
│  [▼ monto               ]      │
│                                 │
│  Agregación                     │
│  [▼ Sum                 ]      │
│                                 │
│  Intervalo                      │
│  [▼ Mes                 ]      │
```

### 4h. Opciones: RECENT_LIST

```
│  Campos a mostrar               │
│  [☑] nombre                     │
│  [☑] created_at                 │
│  [☐] precio                     │
│                                 │
│  Límite de registros            │
│  [▼ 5                   ]      │
```

---

## Pantalla 5: Dashboard Designer List (`/admin/dashboards`)

Solo accesible por Admin.

```
+--[ Sidebar ]--+--[ Contenido Principal ]-------------------------------------+
|               |                                                               |
|               |  Diseñador de Dashboards                  [+ Crear Nuevo]    |
|               |                                                               |
|               |  ┌───────────────────────────────────────────────────────┐   |
|               |  │ Nombre          │ Widgets │ Default │ Fecha  │ Acciones│  |
|               |  ├─────────────────┼─────────┼─────────┼────────┼─────────┤  |
|               |  │ Ventas Q1       │    5    │   ★     │ 1 mar  │ ✎  🗑  │  |
|               |  │ Operaciones     │    3    │         │ 28 feb │ ✎  🗑  │  |
|               |  │ Inventario      │    8    │         │ 25 feb │ ✎  🗑  │  |
|               |  └───────────────────────────────────────────────────────┘   |
|               |                                                               |
+---------------+---------------------------------------------------------------+
```

### Elementos:
- **Header**: Título + botón "Crear Nuevo"
- **Tabla**: lista de dashboards con columnas
  - Nombre, cantidad de widgets, badge default, fecha, acciones
- **Acciones**: Editar (navega al designer), Eliminar (modal de confirmación)
- **Crear Nuevo**: navega a `/admin/dashboards/new`

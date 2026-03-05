# Dashboard Builder - Especificación Visual (Mockups)

> **Última actualización**: Marzo 2026

## 1. Paleta de Colores por Widget

### Colores de fondo para Stat Card y KPI Card

| Color ID | Fondo (light) | Texto | Ícono | Uso sugerido |
|----------|---------------|-------|-------|--------------|
| `blue` | `bg-blue-50` | `text-blue-700` | `text-blue-500` | Conteos generales |
| `green` | `bg-green-50` | `text-green-700` | `text-green-500` | Valores positivos, ingresos |
| `red` | `bg-red-50` | `text-red-700` | `text-red-500` | Alertas, pendientes |
| `yellow` | `bg-yellow-50` | `text-yellow-700` | `text-yellow-500` | Advertencias |
| `purple` | `bg-purple-50` | `text-purple-700` | `text-purple-500` | Métricas especiales |
| `indigo` | `bg-indigo-50` | `text-indigo-700` | `text-indigo-500` | Usuarios, sistema |

### Colores para Charts

Paleta secuencial para barras, secciones de pastel y líneas:

```
#3b82f6 (blue-500)
#10b981 (emerald-500)
#f59e0b (amber-500)
#ef4444 (red-500)
#8b5cf6 (violet-500)
#06b6d4 (cyan-500)
#f97316 (orange-500)
#ec4899 (pink-500)
```

---

## 2. Tamaños de Widgets (Grid de 12 columnas, rowHeight: 80px)

| Tipo | Tamaño mínimo (w x h) | Tamaño por defecto | Tamaño máximo |
|------|------------------------|--------------------|---------------|
| STAT_CARD | 2 x 2 (160px x 160px) | 3 x 2 | 4 x 3 |
| KPI_CARD | 2 x 2 | 3 x 2 | 4 x 3 |
| DATA_GRID | 4 x 3 (320px x 240px) | 6 x 4 | 12 x 8 |
| BAR_CHART | 4 x 3 | 6 x 4 | 12 x 6 |
| PIE_CHART | 3 x 3 | 4 x 4 | 6 x 6 |
| LINE_CHART | 4 x 3 | 6 x 4 | 12 x 6 |
| RECENT_LIST | 3 x 3 | 4 x 4 | 6 x 8 |

---

## 3. Anatomía de Cada Widget

### 3a. STAT_CARD

```
┌──────────────────────────┐
│  ┌────┐                  │
│  │icon│          150     │  <- número grande (text-3xl, font-bold)
│  └────┘       Productos  │  <- etiqueta (text-sm, text-gray-500)
│                          │
│  bg-{color}-50           │  <- fondo según color configurado
└──────────────────────────┘
```

- Padding: `p-6`
- Border radius: `rounded-lg`
- Shadow: `shadow`
- Ícono: 40x40px, posición top-left
- Número: alineado a la derecha, `text-3xl font-bold text-{color}-700`
- Etiqueta: debajo del número, `text-sm text-gray-500`

### 3b. KPI_CARD

```
┌──────────────────────────┐
│  Ventas totales          │  <- label (text-sm, text-gray-500)
│                          │
│  $45,000.00              │  <- valor formateado (text-2xl, font-bold)
│                          │
│  ──────────────────────  │
│  Sum de precio           │  <- descripción de la métrica (text-xs)
└──────────────────────────┘
```

- Padding: `p-6`
- Background: `bg-white`
- Border-left: `border-l-4 border-{color}-500`
- Label arriba, valor grande al centro, descripción abajo

### 3c. DATA_GRID

```
┌──────────────────────────────────────┐
│  Productos                     ▼     │  <- título + indicador
│  ┌──────────┬──────────┬───────────┐ │
│  │ Nombre   │ Precio   │ Categoría │ │  <- headers (bg-gray-50, font-semibold)
│  ├──────────┼──────────┼───────────┤ │
│  │ Prod 1   │ $100     │ Electr.   │ │  <- filas (text-sm)
│  │ Prod 2   │ $250     │ Hogar     │ │
│  │ Prod 3   │ $75      │ Electr.   │ │
│  ├──────────┴──────────┴───────────┤ │
│  │  ◄  Página 1 de 3            ►  │ │  <- paginación compacta
│  └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

- Tabla compacta: `text-sm`, sin bordes externos
- Headers: `bg-gray-50 text-gray-600 font-semibold text-xs uppercase`
- Filas alternadas: `even:bg-gray-25`
- Paginación: compacta, solo flechas + indicador de página

### 3d. BAR_CHART / LINE_CHART

```
┌──────────────────────────────────────┐
│  Productos por Categoría             │  <- título (font-semibold)
│                                      │
│  ██                                  │
│  ██  ██                              │  <- recharts BarChart/LineChart
│  ██  ██  ██                          │
│  ██  ██  ██  ██                      │
│  ──────────────────                  │
│  Cat1 Cat2 Cat3 Cat4                 │
│                                      │
└──────────────────────────────────────┘
```

- Padding: `p-4`
- Título: `text-sm font-semibold text-gray-700 mb-2`
- Chart ocupa el espacio restante con `ResponsiveContainer`
- Tooltip en hover con estilo consistente
- Ejes: `text-xs text-gray-500`

### 3e. PIE_CHART

```
┌──────────────────────────┐
│  Estado de Productos     │
│                          │
│       ┌──────┐           │
│      / Activo \          │
│     |  60%     |         │  <- recharts PieChart
│      \ Inact. /          │
│       └──────┘           │
│                          │
│  ● Activo  ● Inactivo   │  <- leyenda
└──────────────────────────┘
```

- Leyenda debajo del chart, horizontal, `text-xs`
- Porcentajes dentro del pastel o en tooltip
- `innerRadius` para estilo donut: 60% del radius

### 3f. RECENT_LIST

```
┌──────────────────────────┐
│  Últimos Productos       │
│                          │
│  ┌────────────────────┐  │
│  │ Laptop HP          │  │  <- campo principal (font-medium)
│  │ $1,200 · Hace 2h   │  │  <- campos secundarios (text-xs, text-gray-400)
│  ├────────────────────┤  │
│  │ Monitor Samsung    │  │
│  │ $350 · Hace 5h     │  │
│  ├────────────────────┤  │
│  │ Teclado Logitech   │  │
│  │ $80 · Hace 1d      │  │
│  └────────────────────┘  │
└──────────────────────────┘
```

- Lista vertical con separadores `divide-y`
- Primer campo: `text-sm font-medium text-gray-800`
- Campos adicionales: `text-xs text-gray-400`, separados por `·`
- Fecha como tiempo relativo

---

## 4. Estados de los Widgets

### 4a. Loading (Skeleton)

```
┌──────────────────────────┐
│  ┌─────┐                 │
│  │ ░░░ │    ░░░░░░░      │  <- bloques animados con pulse
│  └─────┘    ░░░░░        │
│                          │
└──────────────────────────┘
```

- Usar clases Tailwind: `animate-pulse bg-gray-200 rounded`
- Skeleton imita la forma del widget (barras para charts, filas para grids)
- Cada widget carga independientemente

### 4b. Error

```
┌──────────────────────────┐
│                          │
│     ⚠ Error al cargar    │
│                          │
│   No se pudieron obtener │
│   los datos del widget   │
│                          │
│     [Reintentar]         │
│                          │
└──────────────────────────┘
```

- Ícono de warning: `text-red-400`
- Mensaje: `text-sm text-gray-500`
- Botón reintentar: `text-sm text-primary-600 hover:underline`
- Borde: `border border-red-100`

### 4c. Empty (sin datos)

```
┌──────────────────────────┐
│                          │
│     📊 Sin datos         │
│                          │
│   Esta entidad no tiene  │
│   registros aún          │
│                          │
└──────────────────────────┘
```

- Ícono gris: `text-gray-300`
- Mensaje: `text-sm text-gray-400`

### 4d. Hover (en Designer)

```
┌━━━━━━━━━━━━━━━━━━━━━━━━━━┐  <- borde azul al hacer hover
│                            │
│   (contenido del widget)   │
│                            │
│                         ⤡  │  <- indicador de resize
└━━━━━━━━━━━━━━━━━━━━━━━━━━┘
```

- Borde hover en designer: `ring-2 ring-primary-400`
- Seleccionado: `ring-2 ring-primary-600 shadow-lg`
- Cursor drag: `cursor-grab` (en header) / `cursor-grabbing` (dragging)
- Indicador de resize en esquina inferior derecha

---

## 5. Tipografía

| Elemento | Clase Tailwind |
|----------|----------------|
| Título de página | `text-2xl font-bold text-gray-900` |
| Nombre de dashboard | `text-lg font-semibold text-gray-800` |
| Título de widget | `text-sm font-semibold text-gray-700` |
| Número grande (Stat) | `text-3xl font-bold` |
| Valor KPI | `text-2xl font-bold` |
| Label/Etiqueta | `text-sm text-gray-500` |
| Tabla header | `text-xs font-semibold text-gray-600 uppercase` |
| Tabla body | `text-sm text-gray-700` |
| Eje de chart | `text-xs text-gray-500` |
| Metadata (fecha, count) | `text-xs text-gray-400` |

---

## 6. Espaciado

| Elemento | Valor |
|----------|-------|
| Padding de widget | `p-4` (charts) o `p-6` (cards) |
| Gap entre widgets | Manejado por react-grid-layout margin: `[16, 16]` |
| Padding del contenido principal | `p-6` |
| Panel derecho del designer | `w-80` (320px) |
| Sidebar | `w-64` (256px, ya existente) |

---

## 7. Responsive

| Breakpoint | Columnas Grid | Panel Designer | Cards List |
|------------|---------------|----------------|------------|
| Desktop (>1280px) | 12 | Visible | 3 por fila |
| Tablet (768-1280px) | 8 | Colapsable (toggle) | 2 por fila |
| Mobile (<768px) | 1 (apilado) | Oculto (modal) | 1 por fila |

En mobile:
- Los widgets se apilan verticalmente (1 columna)
- El panel del designer se convierte en un modal/drawer
- La palette de widgets se accede desde un botón flotante
- Las cards de la lista ocupan el ancho completo

---

## 8. Animaciones

| Elemento | Animación | Duración |
|----------|-----------|----------|
| Skeleton loading | `animate-pulse` | Loop continuo |
| Widget aparece | `fade-in + slide-up` | 200ms |
| Drag widget | Ninguna (instantáneo) | - |
| Resize widget | Ninguna (instantáneo) | - |
| Modal abre | `fade-in + scale` | 150ms |
| Toast de éxito/error | `slide-in from top` | 300ms |
| Hover en card (lista) | `shadow-md → shadow-lg` | 150ms |

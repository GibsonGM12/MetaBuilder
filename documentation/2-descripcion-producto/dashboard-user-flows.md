# Dashboard Builder - User Flows

> **Última actualización**: Marzo 2026

## Flow 1: Admin diseña un nuevo dashboard

```
┌─────────┐    ┌──────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Login  │───>│   Sidebar    │───>│ Dashboard Designer│───>│ Crear Dashboard │
│  (Admin)│    │ "Diseñador"  │    │    List           │    │ (nombre, desc)  │
└─────────┘    └──────────────┘    └──────────────────┘    └────────┬────────┘
                                                                    │
                                                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                         Dashboard Designer Canvas                           │
│                                                                              │
│  ┌─────────────────────────────────────────┐  ┌──────────────────────────┐  │
│  │           Grid Interactivo              │  │     Panel Derecho        │  │
│  │    (react-grid-layout, 12 columnas)     │  │                          │  │
│  │                                         │  │  ┌────────────────────┐  │  │
│  │    ┌──────┐  ┌──────┐                   │  │  │  Widget Palette    │  │  │
│  │    │Widget│  │Widget│  <- drag & resize  │  │  │  [+] Stat Card    │  │  │
│  │    └──────┘  └──────┘                   │  │  │  [+] KPI Card     │  │  │
│  │                                         │  │  │  [+] Data Grid    │  │  │
│  │    ┌───────────────┐                    │  │  │  [+] Bar Chart    │  │  │
│  │    │    Widget     │                    │  │  │  [+] Pie Chart    │  │  │
│  │    └───────────────┘                    │  │  │  [+] Line Chart   │  │  │
│  │                                         │  │  │  [+] Recent List  │  │  │
│  └─────────────────────────────────────────┘  │  └────────────────────┘  │  │
│                                                │                          │  │
│                                                │  ┌────────────────────┐  │  │
│                                                │  │  Config Panel      │  │  │
│                                                │  │  (al seleccionar   │  │  │
│                                                │  │   un widget)       │  │  │
│                                                │  │                    │  │  │
│                                                │  │  Título: [____]    │  │  │
│                                                │  │  Entidad: [v___]   │  │  │
│                                                │  │  Opciones...       │  │  │
│                                                │  └────────────────────┘  │  │
│                                                └──────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │  Toolbar: [Nombre dashboard]  [Guardar]  [Preview]  [Descartar]       │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Pasos detallados:

1. Admin inicia sesión y navega a "Dashboard Designer" en el sidebar
2. Ve lista de dashboards existentes con opción "Crear nuevo"
3. Ingresa nombre y descripción del dashboard
4. Se abre el canvas vacío del designer
5. En el panel derecho, selecciona un tipo de widget de la palette
6. El widget aparece en el canvas con posición y tamaño por defecto
7. Admin selecciona el widget en el canvas → aparece el Config Panel
8. En el Config Panel:
   - Escribe un título para el widget
   - Selecciona la entidad fuente (dropdown con todas las entidades)
   - Configura opciones específicas del tipo (aggregation, campos, colores, etc.)
9. Admin arrastra y redimensiona widgets en el grid
10. Repite pasos 5-9 para agregar más widgets
11. Hace clic en "Guardar" → se persiste dashboard + widgets + posiciones
12. Opcionalmente hace clic en "Preview" para ver el resultado

---

## Flow 2: Usuario consume un dashboard

```
┌─────────┐    ┌──────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Login  │───>│   Sidebar    │───>│  Dashboard List  │───>│  Dashboard View  │
│  (User) │    │ "Dashboards" │    │  (cards grid)    │    │  (widgets render)│
└─────────┘    └──────────────┘    └──────────────────┘    └──────────────────┘
```

### Pasos detallados:

1. Usuario inicia sesión
2. Navega a "Dashboards" en el sidebar
3. Ve la lista de dashboards disponibles como cards
   - Cada card muestra: nombre, descripción, cantidad de widgets, fecha
   - Dashboard por defecto tiene badge "Por defecto"
4. Hace clic en un dashboard
5. Se carga la vista del dashboard:
   - Cada widget aparece en su posición configurada
   - Cada widget carga sus datos de forma independiente
   - Widgets muestran skeleton durante la carga
   - Si un widget falla, muestra error sin afectar a los demás
6. El usuario puede interactuar con widgets:
   - Data Grid: paginar entre registros
   - Charts: hover para ver tooltips
   - Todos: ver datos actualizados

---

## Flow 3: Admin edita un dashboard existente

```
┌─────────┐    ┌──────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Login  │───>│  Dashboard   │───>│  Botón "Editar"  │───>│  Dashboard       │
│  (Admin)│    │  View        │    │  (solo Admin)    │    │  Designer        │
└─────────┘    └──────────────┘    └──────────────────┘    └──────────────────┘
                                                                    │
                                                           ┌────────▼────────┐
                                                           │ Canvas con      │
                                                           │ widgets actuales│
                                                           │ (editables)     │
                                                           └────────┬────────┘
                                                                    │
                                           ┌────────────────────────┼──────────────┐
                                           ▼                        ▼              ▼
                                   ┌──────────────┐    ┌──────────────┐  ┌─────────────┐
                                   │ Mover/Resize │    │ Cambiar      │  │ Agregar/    │
                                   │ widgets      │    │ config       │  │ Eliminar    │
                                   └──────────────┘    └──────────────┘  │ widgets     │
                                                                         └─────────────┘
                                                                                │
                                                                       ┌────────▼────────┐
                                                                       │    Guardar      │
                                                                       │    cambios      │
                                                                       └─────────────────┘
```

### Pasos detallados:

1. Admin navega a un dashboard existente
2. Ve el botón "Editar" (solo visible para Admin)
3. Hace clic → se abre el Dashboard Designer con los widgets existentes
4. Puede:
   - Mover widgets arrastrándolos
   - Redimensionar widgets desde los bordes
   - Seleccionar widget → modificar configuración en el Config Panel
   - Agregar nuevos widgets desde la palette
   - Eliminar widgets desde el Config Panel (botón "Eliminar Widget")
5. Hace clic en "Guardar" para persistir los cambios
6. O "Descartar" para volver sin guardar

---

## Flow 4: Admin establece dashboard por defecto

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Dashboard       │───>│ Menú opciones    │───>│  Dashboard       │
│  Designer List   │    │ "Establecer como │    │  marcado como    │
│                  │    │  por defecto"    │    │  default         │
└──────────────────┘    └──────────────────┘    └──────────────────┘
```

### Pasos:

1. En la lista de dashboards del designer, cada dashboard tiene un menú de opciones
2. Admin selecciona "Establecer como por defecto"
3. El dashboard se marca como default
4. El anterior default pierde el flag
5. La página Home ahora muestra este dashboard

---

## Diagrama de navegación

```
                    ┌──────────┐
                    │   Home   │ ──── muestra dashboard default (si existe)
                    │    /     │
                    └──────────┘
                         │
              ┌──────────┼──────────┐
              ▼                     ▼
    ┌──────────────┐      ┌──────────────┐
    │  Dashboards  │      │  Admin       │
    │  /dashboards │      │              │
    └──────┬───────┘      └──────┬───────┘
           │                     │
           ▼                     ▼
    ┌──────────────┐      ┌───────────────────┐
    │  Dashboard   │      │ Dashboard Designer│
    │  View        │◄────>│ /admin/dashboards │
    │  /:id        │edit  └───────┬───────────┘
    └──────────────┘              │
                                  ▼
                           ┌───────────────────┐
                           │ Designer Edit     │
                           │ /:id/edit         │
                           └───────────────────┘
```

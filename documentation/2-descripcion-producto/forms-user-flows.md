# Form Builder - User Flows

> **Última actualización**: Marzo 2026

## Flow 1: Admin diseña un formulario

```
┌─────────┐    ┌──────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Login  │───>│   Sidebar    │───>│ Form Designer    │───>│ Crear Formulario│
│  (Admin)│    │ "Formularios"│    │    List          │    │ (nombre, desc,  │
│         │    │ "Diseñador"  │    │                  │    │  entidad prim.) │
└─────────┘    └──────────────┘    └──────────────────┘    └────────┬────────┘
                                                                   │
                                                                   ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                         Form Designer Canvas                                  │
│                                                                              │
│  ┌─────────────────────────────────────────┐  ┌──────────────────────────┐  │
│  │           Secciones (ordenables)         │  │     Panel Derecho         │  │
│  │           drag & drop                    │  │                          │  │
│  │                                          │  │  ┌────────────────────┐  │  │
│  │    ┌────────────────────┐               │  │  │  Section Palette    │  │  │
│  │    │ Cabecera (FIELDS)   │  <- arrastrar │  │  │  [+] FIELDS         │  │  │
│  │    └────────────────────┘               │  │  │  [+] LOOKUP         │  │  │
│  │    ┌────────────────────┐               │  │  │  [+] DETAIL_TABLE   │  │  │
│  │    │ Cliente (LOOKUP)    │               │  │  │  [+] CALCULATED     │  │  │
│  │    └────────────────────┘               │  │  └────────────────────┘  │  │
│  │    ┌────────────────────┐               │  │                          │  │
│  │    │ Detalle (DETAIL)    │               │  │  ┌────────────────────┐  │  │
│  │    └────────────────────┘               │  │  │  Section Config    │  │  │
│  │    ┌────────────────────┐               │  │  │  (al seleccionar   │  │  │
│  │    │ Totales (CALCULATED)│               │  │  │   una sección)     │  │  │
│  │    └────────────────────┘               │  │  │                    │  │  │
│  └─────────────────────────────────────────┘  │  │  Entidad: [v___]   │  │  │
│                                                │  │  Campos: [☑☑☐]    │  │  │
│  ┌────────────────────────────────────────┐   │  │  Fórmula: [____]   │  │  │
│  │  Toolbar: [Nombre] [Guardar] [Preview]  │   │  └────────────────────┘  │  │
│  └────────────────────────────────────────┘   └──────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Pasos detallados:

1. Admin inicia sesión y navega a "Form Designer" o "Diseñador de Formularios" en el sidebar
2. Ve lista de formularios existentes con opción "Crear nuevo"
3. Ingresa nombre, descripción y selecciona entidad principal del formulario
4. Se abre el canvas vacío del Form Designer
5. En el panel derecho, selecciona un tipo de sección de la palette:
   - **FIELDS**: Agregar sección de campos simples
   - **LOOKUP**: Agregar sección para seleccionar registro relacionado
   - **DETAIL_TABLE**: Agregar sección master-detail (tabla editable)
   - **CALCULATED**: Agregar campo calculado
6. La sección aparece en el canvas; Admin la selecciona
7. En el Section Config Panel:
   - **FIELDS**: Selecciona entidad y campos a mostrar
   - **LOOKUP**: Selecciona entidad destino, relación, campo de visualización
   - **DETAIL_TABLE**: Selecciona entidad detalle, relación 1:N, campos de cada fila
   - **CALCULATED**: Define fórmula (SUM, COUNT), etiqueta, campo destino
8. Repite pasos 5-7 para agregar más secciones
9. Arrastra secciones para reordenar el layout
10. Hace clic en "Guardar" → se persiste formulario + secciones + orden
11. Opcionalmente hace clic en "Preview" para ver el formulario como lo verá el usuario

---

## Flow 2: Usuario llena y envía un formulario

```
┌─────────┐    ┌──────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Login  │───>│   Sidebar    │───>│  Lista de        │───>│  Form Renderer   │
│  (User) │    │ "Formularios"│    │  Formularios     │    │  (formulario     │
│         │    │              │    │  (cards/lista)   │    │   para llenar)   │
└─────────┘    └──────────────┘    └──────────────────┘    └────────┬─────────┘
                                                                     │
                                                                     ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         Formulario: "Captura de Venta"                           │
│                                                                                 │
│  1. Llenar cabecera (FIELDS)                                                    │
│     [Fecha: ____] [Status: ____] [Observaciones: ________]                      │
│                                                                                 │
│  2. Seleccionar lookup (LOOKUP)                                                 │
│     [Buscar cliente... v]  <- RelationLookup                                    │
│                                                                                 │
│  3. Agregar filas detalle (DETAIL_TABLE)                                        │
│     | Producto (lookup) | Cant | Precio | Subtotal | [🗑] |                      │
│     | [Buscar prod...]  | [  ] | [    ] | $0.00    |     |                      │
│     | [Buscar prod...]  | [  ] | [    ] | $0.00    |     |                      │
│     [+ Agregar línea]                                                           │
│                                                                                 │
│  4. Ver total calculado (CALCULATED)                                            │
│     Total: $0.00  <- se actualiza al editar detalles                            │
│                                                                                 │
│  [Guardar]  [Cancelar]                                                          │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                                                                     │
                                                                     ▼
┌──────────────────────────────────┐    ┌──────────────────────────────────┐
│  Validación OK                   │    │  Validación falla                 │
│  POST /api/forms/:id/submit      │    │  Mensajes en campos con error     │
│  Transacción: master + details   │    │  Usuario corrige y reintenta      │
│  Respuesta: éxito + ID           │    └──────────────────────────────────┘
│  Redirige a "Ver registros"     │
└──────────────────────────────────┘
```

### Pasos detallados:

1. Usuario inicia sesión
2. Navega a "Formularios" en el sidebar
3. Ve la lista de formularios disponibles (nombre, descripción, entidad)
4. Hace clic en el formulario que necesita (ej: "Captura de Venta")
5. Se abre el Form Renderer con todas las secciones en orden
6. **Llenar cabecera**: Completa los campos de la sección FIELDS (fecha, status, etc.)
7. **Seleccionar lookup**: Usa el RelationLookup para buscar y seleccionar cliente
8. **Agregar detalle**: 
   - Clic en "Agregar línea" para cada ítem
   - En cada fila: selecciona producto (lookup), ingresa cantidad, precio
   - Subtotal se calcula automáticamente por fila (cantidad × precio)
   - Puede eliminar filas con el botón 🗑
9. **Ver totales**: El campo CALCULATED muestra el total (SUM de subtotales) en tiempo real
10. Revisa que todo esté correcto
11. Hace clic en "Guardar"
12. El backend valida, crea registros en transacción (Ventas + DetalleVenta)
13. Si éxito: mensaje de confirmación, opción de "Ver registros" o "Crear otro"
14. Si error: mensajes de validación, usuario corrige y reintenta

---

## Diagrama de navegación

```
                    ┌──────────┐
                    │   Home   │
                    │    /     │
                    └──────────┘
                         │
              ┌──────────┼──────────┐
              ▼                     ▼
    ┌──────────────┐      ┌──────────────┐
    │ Formularios  │      │  Admin      │
    │ /forms       │      │             │
    └──────┬───────┘      └──────┬───────┘
           │                     │
           ▼                     ▼
    ┌──────────────┐      ┌───────────────────┐
    │ Form         │      │ Form Designer     │
    │ Renderer     │      │ /admin/forms      │
    │ /forms/:id   │◄────>│                   │
    │ (llenar)     │edit  └───────┬───────────┘
    └──────┬───────┘              │
           │                      ▼
           ▼               ┌───────────────────┐
    ┌──────────────┐       │ Designer Edit     │
    │ Ver registros│       │ /admin/forms/:id  │
    │ creados      │       │ /edit             │
    │ (opcional)   │       └───────────────────┘
    └──────────────┘
```

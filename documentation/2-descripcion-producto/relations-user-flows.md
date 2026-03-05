# Relaciones entre Entidades - User Flows

> **Última actualización**: Marzo 2026

## Flow 1: Admin define relación entre entidades

```
┌─────────┐    ┌──────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Login  │───>│   Sidebar    │───>│  Entity Detail   │───>│  Add Field      │
│  (Admin)│    │ "Entidades"  │    │  (ej: Órdenes)   │    │  (Field Manager)│
└─────────┘    └──────────────┘    └──────────────────┘    └────────┬─────────┘
                                                                    │
                                                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                         Configuración de Campo RELATION                       │
│                                                                              │
│  Tipo de campo: [▼ RELATION        ]                                         │
│                                                                              │
│  Entidad destino: [▼ Clientes      ]  <- selector de entidades               │
│                                                                              │
│  Campo de visualización: [▼ nombre ]  <- campos de la entidad destino        │
│                                                                              │
│  Nombre del campo: [cliente________]                                         │
│                                                                              │
│  [Guardar]  [Cancelar]                                                       │
│                                                                              │
│  → Crea entrada en entity_relationships                                      │
│  → ALTER TABLE agrega columna UUID                                           │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Pasos detallados:

1. Admin inicia sesión y navega a "Entidades" en el sidebar
2. Selecciona una entidad (ej: "Órdenes") para ver su detalle
3. En la sección de campos, hace clic en "Agregar campo"
4. En el Field Manager, selecciona tipo de campo **RELATION** en el dropdown
5. Aparecen los controles adicionales:
   - **Entidad destino**: dropdown con todas las entidades (ej: selecciona "Clientes")
   - **Campo de visualización**: dropdown con los campos de la entidad destino (ej: selecciona "nombre")
6. Ingresa el nombre del campo (ej: "cliente")
7. Hace clic en "Guardar"
8. El sistema:
   - Crea/actualiza el registro en `entity_relationships` (source=Órdenes, target=Clientes, type=MANY_TO_ONE)
   - Ejecuta ALTER TABLE para agregar columna UUID a la tabla de Órdenes
   - Persiste el campo en la tabla de metadatos

---

## Flow 2: Usuario usa lookup en formulario CRUD

```
┌─────────┐    ┌──────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Login  │───>│   Sidebar    │───>│  Datos / Entidad │───>│  Crear/Editar    │
│  (User) │    │ "Datos"      │    │  (ej: Órdenes)   │    │  Registro        │
└─────────┘    └──────────────┘    └──────────────────┘    └────────┬─────────┘
                                                                    │
                                                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                         DynamicForm - Campo RELATION                          │
│                                                                              │
│  Fecha: [2026-03-01____]                                                     │
│  Total: [1500.00______]                                                      │
│                                                                              │
│  Cliente: [Mar_____________]  <- autocomplete/dropdown                        │
│           ┌─────────────────────────┐                                        │
│           │ María García            │  <- resultados de GET /lookup?search=Mar│
│           │ Marcos López            │                                        │
│           │ Marta Sánchez           │                                        │
│           └─────────────────────────┘                                        │
│                                                                              │
│  [Guardar]  [Cancelar]                                                       │
│                                                                              │
│  → Usuario selecciona "María García"                                         │
│  → Se guarda el UUID del registro en la columna cliente                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Pasos detallados:

1. Usuario inicia sesión y navega a "Datos"
2. Selecciona la entidad "Órdenes" y hace clic en "Crear" o edita un registro existente
3. Se abre el formulario dinámico (DynamicForm)
4. El campo **Cliente** (tipo RELATION) se renderiza como autocomplete/dropdown
5. Usuario hace clic en el campo o empieza a escribir
6. Al escribir "Mar":
   - Se dispara GET `/api/entities/{clientes_id}/lookup?search=Mar` (con debounce)
   - El dropdown muestra resultados filtrados: "María García", "Marcos López", "Marta Sánchez"
7. Usuario selecciona "María García" del dropdown
8. El valor del campo se establece al UUID del registro de María García
9. Usuario completa el resto del formulario y hace clic en "Guardar"
10. El registro se persiste con `cliente_id = uuid-de-maria-garcia`

---

## Flow 3: Admin gestiona relaciones

```
┌─────────┐    ┌──────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Login  │───>│  Entity      │───>│  Pestaña/Sección │───>│  Relaciones      │
│  (Admin)│    │  Detail      │    │  "Relaciones"    │    │  List            │
└─────────┘    └──────────────┘    └──────────────────┘    └────────┬─────────┘
                                                                    │
                                           ┌────────────────────────┼────────────────┐
                                           ▼                        ▼                ▼
                                   ┌──────────────┐    ┌──────────────┐    ┌─────────────┐
                                   │  Ver lista   │    │  Eliminar    │    │  Agregar    │
                                   │  de          │    │  relación    │    │  (via Add   │
                                   │  relaciones  │    │  (confirmar) │    │   Field)    │
                                   └──────────────┘    └──────────────┘    └─────────────┘
```

### Pasos detallados:

1. Admin navega al detalle de una entidad (ej: "Órdenes")
2. Ve la pestaña o sección **"Relaciones"**
3. **Ver relaciones**:
   - Lista muestra: Órdenes.cliente → Clientes (MANY_TO_ONE)
   - Si la entidad es target de otras: "Órdenes referencia a esta entidad desde campo cliente"
4. **Eliminar relación**:
   - Admin hace clic en "Eliminar" junto a una relación
   - Aparece modal de confirmación: "¿Eliminar relación? Se eliminará el campo y la columna. Los datos existentes se perderán."
   - Admin confirma
   - Se elimina el campo RELATION, la entrada en entity_relationships y se ejecuta DROP COLUMN
5. **Agregar relación** (alternativa):
   - Desde la sección Relaciones puede haber enlace "Agregar relación" que lleva al flujo de Add Field con tipo RELATION preseleccionado

---

## Diagrama de navegación

```
                    ┌──────────┐
                    │  Admin   │
                    │ Entidades│
                    └────┬─────┘
                         │
              ┌──────────┼──────────┐
              ▼                     ▼
    ┌─────────────────┐   ┌─────────────────┐
    │  Entity Detail  │   │  Entity List    │
    │  /entities/:id  │   │  /entities      │
    └────────┬────────┘   └─────────────────┘
             │
    ┌────────┼────────┐
    ▼        ▼        ▼
┌───────┐ ┌───────┐ ┌─────────────┐
│Campos │ │Relac. │ │ Add Field    │
│       │ │(tab)  │ │ → RELATION   │
└───────┘ └───┬───┘ └─────────────┘
              │
              ▼
       ┌─────────────┐
       │ Eliminar    │
       │ relación   │
       └─────────────┘

                    ┌──────────┐
                    │  User    │
                    │  Datos   │
                    └────┬─────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  CRUD Form          │
              │  (DynamicForm)      │
              │  → Campo RELATION   │
              │    = dropdown/      │
              │      autocomplete   │
              │  → GET /lookup      │
              └─────────────────────┘
```

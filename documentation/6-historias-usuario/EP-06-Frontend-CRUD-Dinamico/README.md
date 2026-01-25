# EP-06: Frontend - CRUD Dinámico de Registros

**Objetivo**: Interfaz para gestionar registros de entidades.  
**Tiempo estimado**: 6 horas

---

## Historias de Usuario

| ID | Título | Prioridad | Estimación | Dependencias |
|----|--------|-----------|------------|--------------|
| [US-031](US-031.md) | Crear servicio y hook para CRUD dinámico | P0 | 30 min | US-025 |
| [US-032](US-032.md) | Crear selector de entidad | P0 | 30 min | US-031 |
| [US-033](US-033.md) | Crear tabla dinámica de registros | P0 | 75 min | US-032 |
| [US-034](US-034.md) | Crear formulario dinámico para crear/editar | P0 | 90 min | US-033 |
| [US-035](US-035.md) | Implementar funcionalidad de edición | P0 | 30 min | US-034 |
| [US-036](US-036.md) | Implementar funcionalidad de eliminación | P0 | 20 min | US-033 |
| [US-037](US-037.md) | Mejorar UX con loading states y errores | P0 | 45 min | US-036 |

---

## Flujo de Dependencias

```
US-025 (API Services)
    └── US-031 (CRUD Service/Hook)
            └── US-032 (Selector Entidad)
                    └── US-033 (Tabla Dinámica)
                            ├── US-034 (Formulario Dinámico)
                            │       └── US-035 (Edición)
                            └── US-036 (Eliminación)
                                    └── US-037 (UX/Loading)
```

---

## Tickets Relacionados

- TK-FE-013: Crear servicio CRUD
- TK-FE-014: Crear hook useDynamicEntity
- TK-FE-015: Crear selector de entidad
- TK-FE-016: Crear tabla dinámica
- TK-FE-017: Crear formulario dinámico
- TK-FE-018: Implementar modal y confirmaciones
- TK-FE-019: Implementar loading y mensajes

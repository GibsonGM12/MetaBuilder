# TK-FE-006: Crear AuthContext y useAuth

## Información General

| Campo | Valor |
|-------|-------|
| **ID** | TK-FE-006 |
| **Tipo** | Frontend |
| **Historia** | US-025 |
| **Título** | Implementar contexto de autenticación |
| **Responsable** | Frontend Developer |
| **Estimación** | M (30 min) |
| **Dependencias** | TK-FE-005 |

## Checklist de Implementación

- [ ] Crear `src/context/AuthContext.tsx`
- [ ] Crear `src/hooks/useAuth.ts`
- [ ] Implementar estado: user, token, loading
- [ ] Implementar métodos: login, logout, isAuthenticated
- [ ] Persistir token en localStorage
- [ ] Cargar token al iniciar app

## Definición de Terminado (DoD)

- [ ] Contexto de autenticación funciona
- [ ] Token persiste entre recargas
- [ ] Hook useAuth disponible

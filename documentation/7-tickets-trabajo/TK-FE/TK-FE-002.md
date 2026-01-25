# TK-FE-002: Configurar TailwindCSS

## Información General

| Campo | Valor |
|-------|-------|
| **ID** | TK-FE-002 |
| **Tipo** | Frontend |
| **Historia** | US-005 |
| **Título** | Instalar y configurar TailwindCSS |
| **Responsable** | Frontend Developer |
| **Estimación** | S (10 min) |
| **Dependencias** | TK-FE-001 |

## Descripción Técnica

Agregar TailwindCSS al proyecto React.

## Checklist de Implementación

- [ ] Instalar: `npm install -D tailwindcss postcss autoprefixer`
- [ ] Ejecutar: `npx tailwindcss init -p`
- [ ] Configurar `tailwind.config.js` con paths
- [ ] Agregar directivas Tailwind en `src/index.css`
- [ ] Probar con una clase de Tailwind

## Configuración tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## Definición de Terminado (DoD)

- [ ] Clases de Tailwind funcionan
- [ ] Build de producción funciona

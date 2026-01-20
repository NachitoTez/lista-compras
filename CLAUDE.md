# Proyecto: Lista de Compras Familiar

## Resumen
PWA de inventario del hogar donde items persisten y se cambia su estado (hay/hay poco/no hay). Múltiples usuarios acceden via link compartido sin login. Sincronización en tiempo real.

## Stack
- **Frontend**: React 18 + Vite + TypeScript
- **Estilos**: CSS Modules
- **Backend/DB**: Supabase (PostgreSQL + Realtime)
- **Hosting**: Vercel (frontend) + Supabase (backend)
- **PWA**: vite-plugin-pwa

## Arquitectura

### Flujo de Usuario
1. Usuario entra a `/` → se crea lista nueva → redirect a `/lista/{id}`
2. Usuario comparte el link con familia
3. Todos ven los mismos items y cambios en tiempo real

### Modelo de Datos
- `listas`: id (UUID), nombre, created_at
- `items`: id, lista_id (FK), nombre, estado ('hay'|'hay_poco'|'no_hay'), categoria, created_at

### Estructura de Código
```
src/
├── components/
│   ├── ItemCard.tsx       # Card con botones de estado (verde/amarillo/rojo)
│   ├── ItemList.tsx       # Lista filtrable de items
│   ├── AddItem.tsx        # Form para agregar (nombre + categoría)
│   ├── CategoryFilter.tsx # Pills para filtrar por categoría
│   └── ShareButton.tsx    # Copiar link al clipboard
├── hooks/
│   ├── useList.ts         # Crear/obtener lista por ID
│   └── useItems.ts        # CRUD items + suscripción realtime Supabase
├── lib/
│   └── supabase.ts        # Cliente Supabase
├── types/
│   └── index.ts           # Item, Lista, EstadoItem, Categoria
└── App.tsx                # Router simple (sin react-router, usa URL API)
```

## Historial de Desarrollo

### 2025-01-19 - Setup Inicial
- Creado proyecto con Vite + React + TypeScript
- Instalado @supabase/supabase-js y vite-plugin-pwa
- Implementado todos los componentes y hooks
- Configurado PWA con manifest y service worker
- Creado schema SQL para Supabase
- Configurado vercel.json para SPA routing
- Build exitoso
- Deployado a Vercel: https://lista-compras-beta-three.vercel.app
- Repo GitHub: https://github.com/NachitoTez/lista-compras

### 2025-01-19 - UX Improvements
- Edición inline de nombres (click para editar, Enter/Escape)
- Cards con fondo de color según estado (rgba con opacidad sutil)
- Ordenamiento por estado: no_hay → hay_poco → hay
- Indicador de estado simplificado: 3 dots clickeables
- Botón eliminar mejorado (× en gris, rojo en hover)

## Estado Actual
✅ App funcionando en producción
✅ Realtime sync funcionando entre dispositivos

## Comandos Útiles
```bash
npm run dev      # Desarrollo local
npm run build    # Build producción
npm run preview  # Preview del build
```

## Notas Técnicas
- RLS (Row Level Security) configurado como permisivo para permitir acceso sin auth
- Realtime usa canal por lista_id para eficiencia
- Router es manual (sin react-router) usando History API
- Estados de items: hay (verde), hay_poco (amarillo), no_hay (rojo)

## TODOs Futuros (si el usuario quiere)
- [ ] Agregar autenticación opcional
- [ ] Permitir renombrar lista
- [ ] Agregar orden/drag-and-drop de items
- [ ] Modo offline mejorado con sync

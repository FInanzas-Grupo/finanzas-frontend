# finanzas-frontend — Guía para Agentes de Código

SPA del simulador de crédito vehicular **Compra Inteligente**. Consume la API REST de `finanzas-backend`.

---

## Stack

- React 18
- Vite 5 (bundler + dev server)
- React Router DOM v6 (client-side routing)
- Zustand 4 (estado global de auth con persistencia localStorage)
- Axios 1 (HTTP client con interceptores)
- Tailwind CSS 3 (estilos utilitarios via PostCSS)

## Estructura de archivos

```
src/
├── main.jsx                       # Entry point: ReactDOM.render(<BrowserRouter><AppRoutes /></BrowserRouter>)
├── api/
│   ├── http.js                    # Axios instance con interceptores (JWT + 401 → logout)
│   └── services.js                # Funciones API organizadas por dominio
├── components/
│   ├── FormField.jsx              # Componentes reutilizables InputField, SelectField
│   ├── Layout.jsx                 # App shell: sidebar + header + Outlet
│   └── ProtectedRoute.jsx         # Auth guard: redirige a /login si no hay token
├── pages/
│   ├── Login.jsx                  # Formulario de inicio de sesión
│   ├── Register.jsx               # Formulario de registro
│   ├── Dashboard.jsx              # Página principal (bienvenida + stats básicos)
│   ├── Clientes.jsx               # CRUD de clientes (tabla + modal crear/editar)
│   ├── Vehiculos.jsx              # CRUD de vehículos (tabla + modal crear/editar)
│   ├── Simulador.jsx              # Formulario de simulación + resultados + cronograma
│   └── Historial.jsx              # Tabla de simulaciones guardadas
├── routes/
│   └── AppRoutes.jsx              # Definición de todas las rutas
├── store/
│   └── authStore.js               # Zustand store: token, user, login(), logout()
└── styles/
    └── index.css                  # Directivas Tailwind + clases personalizadas
```

## Rutas

| Ruta | Componente | Layout | Auth |
|---|---|---|---|
| `/login` | Login | No (página completa) | No |
| `/register` | Register | No (página completa) | No |
| `/` | Dashboard | Layout (sidebar) | Sí |
| `/clientes` | Clientes | Layout (sidebar) | Sí |
| `/vehiculos` | Vehiculos | Layout (sidebar) | Sí |
| `/simulador` | Simulador | Layout (sidebar) | Sí |
| `/historial` | Historial | Layout (sidebar) | Sí |

## Flujo de autenticación

### Almacenamiento (`src/store/authStore.js`)

```js
useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: ({ token, user }) => set({ token, user }),
      logout: () => set({ token: null, user: null })
    }),
    { name: "finances-auth" }  // clave en localStorage
  )
)
```

### Interceptor HTTP (`src/api/http.js`)

- **Request:** inyecta `Authorization: Bearer <token>` desde el store en cada petición
- **Response:** si el backend responde 401 → ejecuta `logout()` automáticamente

### Guard de ruta (`src/components/ProtectedRoute.jsx`)

- Lee `token` del store
- Si no hay token → `<Navigate to="/login" />`
- Si hay token → renderiza children

## Servicios API (`src/api/services.js`)

```js
authApi = {
  login(payload),        // POST /auth/login
  register(payload),     // POST /auth/register
  me()                   // GET /auth/me
}

clientesApi = {
  list(),                // GET /clientes
  create(payload),       // POST /clientes
  update(id, payload),   // PUT /clientes/:id
  remove(id)             // DELETE /clientes/:id
}

vehiculosApi = {
  list(),                // GET /vehiculos
  create(payload),       // POST /vehiculos
  update(id, payload),   // PUT /vehiculos/:id
  remove(id)             // DELETE /vehiculos/:id
}

simulacionesApi = {
  list(),                // GET /simulaciones
  create(payload),       // POST /simulaciones
  get(id)                // GET /simulaciones/:id
}
```

## Páginas en detalle

### Login (`src/pages/Login.jsx`)
- Formulario: email + password
- Llama a `authApi.login()` → guarda token/user en store → redirige a `/`
- Muestra errores del servidor

### Register (`src/pages/Register.jsx`)
- Formulario: nombre + email + password + confirmar password
- Valida que passwords coincidan del lado del cliente
- Llama a `authApi.register()` → redirige a `/login`

### Dashboard (`src/pages/Dashboard.jsx`)
- Página de bienvenida
- Muestra nombre del usuario desde el store
- Tarjetas resumen con links a Clientes, Vehículos, Simulador, Historial

### Clientes (`src/pages/Clientes.jsx`)
- Tabla con todos los clientes del usuario
- Botón "Nuevo Cliente" → modal con formulario
- Botones editar/eliminar por fila
- Confirmación antes de eliminar
- Estados: carga, vacío, error

### Vehiculos (`src/pages/Vehiculos.jsx`)
- Tabla con todos los vehículos (incluye nombre del cliente)
- Botón "Nuevo Vehículo" → modal con formulario (cliente, marca, modelo, año, tipo, moneda, precio)
- Filtro inline por cliente (select)
- Botones editar/eliminar por fila

### Simulador (`src/pages/Simulador.jsx`) — [página principal]
- Carga clientes y vehículos al montar
- **Select de Cliente** → filtra vehículos del cliente
- **Select de Vehículo** → auto-completa precio y moneda
- Parámetros de simulación en formulario de 4 columnas:
  - Moneda, Precio vehículo, Cuota inicial
  - Tipo de tasa (efectiva/nominal), Tasa anual (%), Capitalización (solo para nominal)
  - Plazo (meses), Tipo de gracia, Meses de gracia
  - Cuota balón (%), Cuota balón fija (opcional)
  - Seguro mensual, Comisión mensual, Gastos mensuales
  - Fecha de inicio
- **Resultados** (tarjetas superiores):
  - Cuota ordinaria (monto en moneda)
  - VAN (monto en moneda)
  - TIR mensual (%)
  - TCEA (%)
- **Cronograma de pagos** (tabla):
  - N°, Fecha, Tipo, Saldo inicial, Interés, Amortización, Cuota, Balón, Flujo total, Saldo final

### Historial (`src/pages/Historial.jsx`)
- Tabla de simulaciones previas (cliente, vehículo, monto, plazo, cuota, TCEA, fecha)
- Botón "Ver detalle" → modal expandido con cronograma completo
- Estados: carga, vacío, error

## Layout (`src/components/Layout.jsx`)

- Sidebar fijo izquierdo (w-64) con:
  - Logo "FINANCES - Compra Inteligente"
  - Navegación: Dashboard, Clientes, Vehículos, Simulador, Historial
  - Enlace activo resaltado (uso de `useLocation`)
  - Footer: nombre del usuario + botón "Cerrar sesión"
- Área principal con `<Outlet />` para rutas hijas
- Diseño responsive básico (sidebar se mantiene fija en desktop)

## Componentes compartidos (`src/components/FormField.jsx`)

- `FormField` — label + input con clases Tailwind consistentes
- `SelectField` — label + select con mismas clases
- Props: `label`, `name`, `value`, `onChange`, `type`, `required`, `disabled`, `step`, `children`

## Estilos (`src/styles/index.css`)

Clases utilitarias personalizadas definidas con `@apply`:

```css
.input     → input base con borde, padding, rounded, focus ring
.label     → text-sm font-medium text-gray-700
.btn-primary  → botón azul oscuro (bg-indigo-600)
.btn-secondary → botón gris (bg-gray-200)
.card      → contenedor con bg-white, shadow, rounded, padding
```

## Variables de entorno (`.env`)

```
VITE_API_URL=http://localhost:3000/api
```

## Scripts NPM

```bash
npm run dev      # Vite dev server → http://localhost:5173
npm run build    # Build producción → dist/
npm run preview  # Vista previa del build → http://localhost:4173
```

## Configuración relevante

### `postcss.config.js`
Registra `tailwindcss` y `autoprefixer` como plugins de PostCSS.

### `tailwind.config.js`
- Content: `./index.html` y `./src/**/*.{js,jsx}`
- Sin personalización de tema (usa valores por defecto)

### `vite.config.js`
- Plugin `@vitejs/plugin-react`
- Sin proxy configurado (las llamadas API van directo a `VITE_API_URL`)

### `render.yaml`
- **Type:** Static Site
- **Build:** `npm install && npm run build`
- **Publish:** `dist`
- **Env:** `VITE_API_URL` apunta al backend desplegado

## Convenciones de código

- Estado local con `useState` + `useEffect` (no se usa React Query ni Redux)
- Llamadas API directas en los efectos/manejadores de eventos
- `useMemo` para filtrados derivados (ej: vehículos por cliente)
- Errores manejados con `try/catch` y mostrados en el UI
- Formularios controlados (cada input actualiza el estado vía `onChange`)
- Sin TypeScript — todo JavaScript plano con JSX

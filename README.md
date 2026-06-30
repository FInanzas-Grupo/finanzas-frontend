# Finanzas Frontend

Aplicación web del simulador de crédito vehicular **Compra Inteligente**.

## Stack

- React 18
- Vite 5
- React Router 6
- Zustand 4
- Axios
- Tailwind CSS 3

## Requisitos

- Node.js 18+

## Variables de entorno

Copiar `.env.example` a `.env` y configurar:

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base de la API (default: `http://localhost:3000/api`) |

## Instalación

```bash
npm install
npm run dev     # Desarrollo (puerto 5173)
npm run build   # Build producción
npm run preview # Vista previa del build
```

## Deploy en Render

El archivo `render.yaml` permite deploy automatizado como **Static Site**. Conectar el repo en Render Dashboard usando **Blueprint**.

Asegurarse de configurar `VITE_API_URL` apuntando al backend desplegado.

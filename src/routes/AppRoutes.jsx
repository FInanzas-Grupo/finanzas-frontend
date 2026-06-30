import { Routes, Route } from "react-router-dom";
import { Layout } from "../components/Layout.jsx";
import { ProtectedRoute } from "../components/ProtectedRoute.jsx";
import { Login } from "../pages/Login.jsx";
import { Register } from "../pages/Register.jsx";
import { Dashboard } from "../pages/Dashboard.jsx";
import { Clientes } from "../pages/Clientes.jsx";
import { Vehiculos } from "../pages/Vehiculos.jsx";
import { Simulador } from "../pages/Simulador.jsx";
import { Historial } from "../pages/Historial.jsx";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="vehiculos" element={<Vehiculos />} />
        <Route path="simulador" element={<Simulador />} />
        <Route path="historial" element={<Historial />} />
      </Route>
    </Routes>
  );
}

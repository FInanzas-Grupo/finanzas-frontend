import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/services.js";
import { useAuthStore } from "../store/authStore.js";
import { FormField } from "../components/FormField.jsx";

export function Register() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const [error, setError] = useState("");
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await authApi.register(form);
      login(data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "No se pudo registrar");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-slate-950">Crear cuenta</h1>
        <p className="text-gray-500 mb-6">Acceso obligatorio para usar el sistema</p>
        <div className="space-y-4">
          <FormField label="Nombre" name="nombre" value={form.nombre} onChange={onChange} required />
          <FormField label="Correo" name="email" type="email" value={form.email} onChange={onChange} required />
          <FormField label="Contraseña" name="password" type="password" value={form.password} onChange={onChange} required />
        </div>
        {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button className="btn-primary mt-6 w-full">Registrarme</button>
        <p className="text-sm text-center mt-4 text-gray-600">
          Ya tengo cuenta <Link className="text-blue-700 font-semibold" to="/login">Iniciar sesión</Link>
        </p>
      </form>
    </div>
  );
}

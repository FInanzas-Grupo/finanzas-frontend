import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/services.js";
import { useAuthStore } from "../store/authStore.js";
import { FormField } from "../components/FormField.jsx";

export function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [form, setForm] = useState({ email: "admin@finances.com", password: "123456" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await authApi.login(form);
      login(data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-slate-950">FINANCES</h1>
        <p className="text-gray-500 mb-6">Simulador de crédito vehicular - Compra Inteligente</p>
        <div className="space-y-4">
          <FormField label="Correo" name="email" value={form.email} onChange={onChange} />
          <FormField label="Contraseña" name="password" type="password" value={form.password} onChange={onChange} />
        </div>
        {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button disabled={loading} className="btn-primary mt-6 w-full">
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>
        <p className="text-sm text-center mt-4 text-gray-600">
          ¿No tienes cuenta? <Link className="text-blue-700 font-semibold" to="/register">Crear cuenta</Link>
        </p>
      </form>
    </div>
  );
}

import { useEffect, useState } from "react";
import { clientesApi } from "../api/services.js";
import { FormField, SelectField } from "../components/FormField.jsx";

const empty = { dni: "", nombres: "", apellidos: "", correo: "", celular: "", direccion: "", ingresoMensual: 0, tipoTrabajador: "dependiente" };

export function Clientes() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    const { data } = await clientesApi.list();
    setItems(data);
  };

  useEffect(() => { load(); }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await clientesApi.update(editingId, form);
      else await clientesApi.create(form);
      setForm(empty);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar cliente");
    }
  };

  const edit = (c) => {
    setEditingId(c.id);
    setForm({ ...c, ingresoMensual: c.ingresoMensual || 0 });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Clientes</h2>
      <div className="grid grid-cols-3 gap-6">
        <form onSubmit={onSubmit} className="card col-span-1 space-y-3">
          <h3 className="font-bold text-lg">{editingId ? "Editar cliente" : "Nuevo cliente"}</h3>
          <FormField label="DNI" name="dni" value={form.dni} onChange={onChange} required />
          <FormField label="Nombres" name="nombres" value={form.nombres} onChange={onChange} required />
          <FormField label="Apellidos" name="apellidos" value={form.apellidos} onChange={onChange} required />
          <FormField label="Correo" name="correo" value={form.correo || ""} onChange={onChange} />
          <FormField label="Celular" name="celular" value={form.celular || ""} onChange={onChange} />
          <FormField label="Ingreso mensual" name="ingresoMensual" type="number" value={form.ingresoMensual} onChange={onChange} />
          <SelectField label="Tipo de trabajador" name="tipoTrabajador" value={form.tipoTrabajador} onChange={onChange}>
            <option value="dependiente">Dependiente</option>
            <option value="independiente">Independiente</option>
          </SelectField>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button className="btn-primary w-full">Guardar</button>
          {editingId && <button type="button" className="btn-secondary w-full" onClick={() => { setEditingId(null); setForm(empty); }}>Cancelar</button>}
        </form>

        <div className="card col-span-2 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left border-b"><th>DNI</th><th>Cliente</th><th>Ingreso</th><th>Acción</th></tr></thead>
            <tbody>
              {items.map(c => (
                <tr key={c.id} className="border-b">
                  <td className="py-2">{c.dni}</td>
                  <td>{c.nombres} {c.apellidos}</td>
                  <td>{Number(c.ingresoMensual).toFixed(2)}</td>
                  <td><button className="text-blue-700 font-semibold" onClick={() => edit(c)}>Editar</button></td>
                </tr>
              ))}
              {items.length === 0 && <tr><td className="py-4 text-gray-500" colSpan="4">No hay clientes registrados.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

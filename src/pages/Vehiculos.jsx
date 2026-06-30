import { useEffect, useState } from "react";
import { clientesApi, vehiculosApi } from "../api/services.js";
import { FormField, SelectField } from "../components/FormField.jsx";

const empty = { clienteId: "", marca: "", modelo: "", anio: 2024, tipo: "auto", moneda: "PEN", precio: 0 };

export function Vehiculos() {
  const [clientes, setClientes] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    const [c, v] = await Promise.all([clientesApi.list(), vehiculosApi.list()]);
    setClientes(c.data);
    setItems(v.data);
  };
  useEffect(() => { load(); }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (editingId) await vehiculosApi.update(editingId, form);
    else await vehiculosApi.create(form);
    setForm(empty);
    setEditingId(null);
    await load();
  };

  const edit = (v) => {
    setEditingId(v.id);
    setForm({ clienteId: v.clienteId, marca: v.marca, modelo: v.modelo, anio: v.anio, tipo: v.tipo, moneda: v.moneda, precio: v.precio });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Vehículos</h2>
      <div className="grid grid-cols-3 gap-6">
        <form onSubmit={onSubmit} className="card col-span-1 space-y-3">
          <h3 className="font-bold text-lg">{editingId ? "Editar vehículo" : "Nuevo vehículo"}</h3>
          <SelectField label="Cliente" name="clienteId" value={form.clienteId} onChange={onChange} required>
            <option value="">Seleccione</option>
            {clientes.map(c => <option key={c.id} value={c.id}>{c.nombres} {c.apellidos}</option>)}
          </SelectField>
          <FormField label="Marca" name="marca" value={form.marca} onChange={onChange} required />
          <FormField label="Modelo" name="modelo" value={form.modelo} onChange={onChange} required />
          <FormField label="Año" name="anio" type="number" value={form.anio} onChange={onChange} />
          <FormField label="Tipo" name="tipo" value={form.tipo} onChange={onChange} />
          <SelectField label="Moneda" name="moneda" value={form.moneda} onChange={onChange}>
            <option value="PEN">Soles</option>
            <option value="USD">Dólares</option>
          </SelectField>
          <FormField label="Precio" name="precio" type="number" value={form.precio} onChange={onChange} required />
          <button className="btn-primary w-full">Guardar</button>
          {editingId && <button type="button" className="btn-secondary w-full" onClick={() => { setEditingId(null); setForm(empty); }}>Cancelar</button>}
        </form>

        <div className="card col-span-2 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left border-b"><th>Vehículo</th><th>Cliente</th><th>Precio</th><th>Acción</th></tr></thead>
            <tbody>
              {items.map(v => (
                <tr key={v.id} className="border-b">
                  <td className="py-2">{v.marca} {v.modelo} {v.anio}</td>
                  <td>{v.Cliente?.nombres} {v.Cliente?.apellidos}</td>
                  <td>{v.moneda} {Number(v.precio).toFixed(2)}</td>
                  <td><button className="text-blue-700 font-semibold" onClick={() => edit(v)}>Editar</button></td>
                </tr>
              ))}
              {items.length === 0 && <tr><td className="py-4 text-gray-500" colSpan="4">No hay vehículos registrados.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { clientesApi, vehiculosApi, simulacionesApi } from "../api/services.js";
import { FormField, SelectField } from "../components/FormField.jsx";

const initial = {
  clienteId: "",
  vehiculoId: "",
  moneda: "PEN",
  precioVehiculo: 0,
  cuotaInicial: 0,
  tipoTasa: "efectiva",
  tasaAnual: 18,
  capitalizacion: 12,
  plazoMeses: 36,
  tipoGracia: "ninguna",
  mesesGracia: 0,
  porcentajeBalon: 50,
  cuotaBalon: "",
  seguroMensual: 0,
  comisionMensual: 0,
  gastosMensuales: 0,
  fechaInicio: new Date().toISOString().slice(0, 10)
};

function pct(value) {
  if (value === null || value === undefined) return "-";
  return `${(Number(value) * 100).toFixed(4)}%`;
}

export function Simulador() {
  const [clientes, setClientes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [form, setForm] = useState(initial);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([clientesApi.list(), vehiculosApi.list()]).then(([c, v]) => {
      setClientes(c.data);
      setVehiculos(v.data);
    });
  }, []);

  const vehiculosFiltrados = useMemo(() => vehiculos.filter(v => String(v.clienteId) === String(form.clienteId)), [vehiculos, form.clienteId]);

  const onChange = (e) => {
    const next = { ...form, [e.target.name]: e.target.value };
    if (e.target.name === "vehiculoId") {
      const v = vehiculos.find(item => String(item.id) === String(e.target.value));
      if (v) {
        next.precioVehiculo = v.precio;
        next.moneda = v.moneda;
      }
    }
    setForm(next);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await simulacionesApi.create(form);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Error al simular");
    } finally {
      setLoading(false);
    }
  };

  const resumen = result?.resumen || {};
  const rows = result?.CronogramaPagos || [];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Simulador de Compra Inteligente</h2>
      <p className="text-gray-600 mb-6">Método francés vencido ordinario con meses de 30 días.</p>

      <form onSubmit={onSubmit} className="card grid grid-cols-4 gap-4 mb-6">
        <SelectField label="Cliente" name="clienteId" value={form.clienteId} onChange={onChange} required>
          <option value="">Seleccione</option>
          {clientes.map(c => <option key={c.id} value={c.id}>{c.nombres} {c.apellidos}</option>)}
        </SelectField>
        <SelectField label="Vehículo" name="vehiculoId" value={form.vehiculoId} onChange={onChange} required>
          <option value="">Seleccione</option>
          {vehiculosFiltrados.map(v => <option key={v.id} value={v.id}>{v.marca} {v.modelo} - {v.moneda} {v.precio}</option>)}
        </SelectField>
        <SelectField label="Moneda" name="moneda" value={form.moneda} onChange={onChange}>
          <option value="PEN">Soles</option>
          <option value="USD">Dólares</option>
        </SelectField>
        <FormField label="Precio vehículo" name="precioVehiculo" type="number" value={form.precioVehiculo} onChange={onChange} required />
        <FormField label="Cuota inicial" name="cuotaInicial" type="number" value={form.cuotaInicial} onChange={onChange} required />
        <SelectField label="Tipo de tasa" name="tipoTasa" value={form.tipoTasa} onChange={onChange}>
          <option value="efectiva">Efectiva anual</option>
          <option value="nominal">Nominal anual</option>
        </SelectField>
        <FormField label="Tasa anual (%)" name="tasaAnual" type="number" step="0.01" value={form.tasaAnual} onChange={onChange} required />
        <SelectField label="Capitalización" name="capitalizacion" value={form.capitalizacion} onChange={onChange} disabled={form.tipoTasa !== "nominal"}>
          <option value="12">Mensual</option>
          <option value="6">Bimestral</option>
          <option value="4">Trimestral</option>
          <option value="2">Semestral</option>
          <option value="1">Anual</option>
        </SelectField>
        <FormField label="Plazo meses" name="plazoMeses" type="number" value={form.plazoMeses} onChange={onChange} required />
        <SelectField label="Tipo de gracia" name="tipoGracia" value={form.tipoGracia} onChange={onChange}>
          <option value="ninguna">Ninguna</option>
          <option value="total">Gracia total</option>
          <option value="parcial">Gracia parcial</option>
        </SelectField>
        <FormField label="Meses de gracia" name="mesesGracia" type="number" value={form.mesesGracia} onChange={onChange} />
        <FormField label="Cuota balón (%)" name="porcentajeBalon" type="number" step="0.01" value={form.porcentajeBalon} onChange={onChange} />
        <FormField label="Cuota balón fija opcional" name="cuotaBalon" type="number" value={form.cuotaBalon} onChange={onChange} />
        <FormField label="Seguro mensual" name="seguroMensual" type="number" value={form.seguroMensual} onChange={onChange} />
        <FormField label="Comisión mensual" name="comisionMensual" type="number" value={form.comisionMensual} onChange={onChange} />
        <FormField label="Gastos mensuales" name="gastosMensuales" type="number" value={form.gastosMensuales} onChange={onChange} />
        <FormField label="Fecha inicio" name="fechaInicio" type="date" value={form.fechaInicio} onChange={onChange} />
        <div className="col-span-4 flex gap-3">
          <button disabled={loading} className="btn-primary">{loading ? "Calculando..." : "Calcular simulación"}</button>
        </div>
        {error && <p className="col-span-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      </form>

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="card"><p className="text-sm text-gray-500">Cuota ordinaria</p><h3 className="text-xl font-bold">{result.moneda} {Number(resumen.cuotaOrdinaria).toFixed(2)}</h3></div>
            <div className="card"><p className="text-sm text-gray-500">VAN</p><h3 className="text-xl font-bold">{result.moneda} {Number(resumen.van).toFixed(2)}</h3></div>
            <div className="card"><p className="text-sm text-gray-500">TIR mensual</p><h3 className="text-xl font-bold">{pct(resumen.tirMensual)}</h3></div>
            <div className="card"><p className="text-sm text-gray-500">TCEA aprox.</p><h3 className="text-xl font-bold">{pct(resumen.tcea)}</h3></div>
          </div>

          <div className="card overflow-x-auto">
            <h3 className="text-xl font-bold mb-3">Cronograma de pagos</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left border-b">
                  <th>N°</th><th>Fecha</th><th>Tipo</th><th>Saldo inicial</th><th>Interés</th><th>Amortización</th><th>Cuota</th><th>Balón</th><th>Flujo</th><th>Saldo final</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id} className="border-b">
                    <td className="py-2">{r.numeroCuota}</td>
                    <td>{r.fechaPago}</td>
                    <td>{r.tipo}</td>
                    <td>{Number(r.saldoInicial).toFixed(2)}</td>
                    <td>{Number(r.interes).toFixed(2)}</td>
                    <td>{Number(r.amortizacion).toFixed(2)}</td>
                    <td>{Number(r.cuota).toFixed(2)}</td>
                    <td>{Number(r.cuotaBalon).toFixed(2)}</td>
                    <td>{Number(r.flujoTotal).toFixed(2)}</td>
                    <td>{Number(r.saldoFinal).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

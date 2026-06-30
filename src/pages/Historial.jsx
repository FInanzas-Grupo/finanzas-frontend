import { useEffect, useState } from "react";
import { simulacionesApi } from "../api/services.js";

function pct(value) {
  if (value === null || value === undefined) return "-";
  return `${(Number(value) * 100).toFixed(4)}%`;
}

export function Historial() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    simulacionesApi.list().then(({ data }) => setItems(data));
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Historial de simulaciones</h2>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th>ID</th><th>Cliente</th><th>Vehículo</th><th>Monto</th><th>Cuota</th><th>TCEA</th><th>Total pagado</th>
            </tr>
          </thead>
          <tbody>
            {items.map(s => (
              <tr key={s.id} className="border-b">
                <td className="py-2">{s.id}</td>
                <td>{s.Cliente?.nombres} {s.Cliente?.apellidos}</td>
                <td>{s.Vehiculo?.marca} {s.Vehiculo?.modelo}</td>
                <td>{s.moneda} {Number(s.montoFinanciado).toFixed(2)}</td>
                <td>{s.moneda} {Number(s.resumen?.cuotaOrdinaria || 0).toFixed(2)}</td>
                <td>{pct(s.resumen?.tcea)}</td>
                <td>{s.moneda} {Number(s.resumen?.totalPagado || 0).toFixed(2)}</td>
              </tr>
            ))}
            {items.length === 0 && <tr><td className="py-4 text-gray-500" colSpan="7">Todavía no hay simulaciones.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

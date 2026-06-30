import { useEffect, useState } from "react";
import { simulacionesApi } from "../api/services.js";

function pct(value) {
  if (value === null || value === undefined) return "-";
  return `${(Number(value) * 100).toFixed(4)}%`;
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("es-PE", {
    year: "numeric", month: "2-digit", day: "2-digit"
  });
}

export function Historial() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    simulacionesApi.list()
      .then(({ data }) => setItems(data))
      .catch(() => setError("Error al cargar el historial"))
      .finally(() => setLoading(false));
  }, []);

  const verDetalle = async (id) => {
    setDetailLoading(true);
    try {
      const { data } = await simulacionesApi.get(id);
      setDetail(data);
    } catch {
      setError("Error al cargar el detalle de la simulación");
    } finally {
      setDetailLoading(false);
    }
  };

  const d = detail;
  const cronograma = d?.CronogramaPagos || [];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Historial de simulaciones</h2>

      {loading && (
        <div className="card text-center py-8 text-gray-500">Cargando simulaciones...</div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 mb-4">{error}</div>
      )}

      {!loading && !error && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th>ID</th>
                <th>Cliente</th>
                <th>Vehículo</th>
                <th>Monto</th>
                <th>Plazo</th>
                <th>Cuota</th>
                <th>TCEA</th>
                <th>Total pagado</th>
                <th>Fecha</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {items.map(s => (
                <tr key={s.id} className="border-b">
                  <td className="py-2">{s.id}</td>
                  <td>{s.Cliente?.nombres} {s.Cliente?.apellidos}</td>
                  <td>{s.Vehiculo?.marca} {s.Vehiculo?.modelo}</td>
                  <td>{s.moneda} {Number(s.montoFinanciado).toFixed(2)}</td>
                  <td>{s.plazoMeses} meses</td>
                  <td>{s.moneda} {Number(s.resumen?.cuotaOrdinaria || 0).toFixed(2)}</td>
                  <td>{pct(s.resumen?.tcea)}</td>
                  <td>{s.moneda} {Number(s.resumen?.totalPagado || 0).toFixed(2)}</td>
                  <td>{formatDate(s.createdAt)}</td>
                  <td>
                    <button
                      onClick={() => verDetalle(s.id)}
                      className="text-indigo-600 hover:underline font-medium"
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td className="py-4 text-gray-500" colSpan="10">
                    Todavía no hay simulaciones.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {detail && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-10 pb-10 overflow-y-auto"
          onClick={() => setDetail(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-11/12 max-w-5xl max-h-[90vh] overflow-y-auto p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold">Detalle de simulación #{d.id}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {d.Cliente?.nombres} {d.Cliente?.apellidos} — {d.Vehiculo?.marca} {d.Vehiculo?.modelo}
                </p>
              </div>
              <button
                onClick={() => setDetail(null)}
                className="text-gray-400 hover:text-gray-700 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="card">
                <p className="text-sm text-gray-500">Monto financiado</p>
                <p className="text-lg font-bold">{d.moneda} {Number(d.montoFinanciado).toFixed(2)}</p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-500">Plazo</p>
                <p className="text-lg font-bold">{d.plazoMeses} meses</p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-500">Cuota ordinaria</p>
                <p className="text-lg font-bold">{d.moneda} {Number(d.resumen?.cuotaOrdinaria || 0).toFixed(2)}</p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-500">TCEA</p>
                <p className="text-lg font-bold">{pct(d.resumen?.tcea)}</p>
              </div>
            </div>

            <h4 className="text-lg font-bold mb-3">Cronograma de pagos</h4>

            {detailLoading ? (
              <div className="text-center py-8 text-gray-500">Cargando cronograma...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left border-b">
                      <th>N°</th>
                      <th>Fecha</th>
                      <th>Tipo</th>
                      <th>Saldo inicial</th>
                      <th>Interés</th>
                      <th>Amortización</th>
                      <th>Cuota</th>
                      <th>Balón</th>
                      <th>Flujo</th>
                      <th>Saldo final</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cronograma.map(r => (
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}

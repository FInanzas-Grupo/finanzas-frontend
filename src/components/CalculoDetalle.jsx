import { useState, useMemo } from "react";

function pct(value) {
  if (value === null || value === undefined) return "-";
  return `${(Number(value) * 100).toFixed(4)}%`;
}

export function CalculoDetalle({ flujosDeudor, tem, van, tirMensual, tirAnual, tcea, tirPasos, moneda }) {
  const [open, setOpen] = useState(false);

  const flujosDescontados = useMemo(() => {
    if (!flujosDeudor || tem === undefined) return [];
    return flujosDeudor.map((cf, t) => ({
      periodo: t,
      flujo: cf,
      factor: Math.pow(1 + tem, t),
      descontado: cf / Math.pow(1 + tem, t)
    }));
  }, [flujosDeudor, tem]);

  if (!flujosDeudor || flujosDeudor.length === 0) return null;

  return (
    <div className="card">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center text-left font-bold text-lg"
      >
        <span>Detalle de cálculos</span>
        <span className="text-gray-400 text-xl">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="mt-4 space-y-6">
          {/* VAN */}
          <div>
            <h4 className="font-bold text-base mb-2">Valor Actual Neto (VAN)</h4>
            <p className="text-xs text-gray-500 mb-3 font-mono">
              VAN = Σ CFₜ / (1 + TEM)<sup>t</sup>
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pr-2">t</th>
                    <th className="pr-2">Flujo (CFₜ)</th>
                    <th className="pr-2">(1+TEM)<sup>t</sup></th>
                    <th className="pr-2">CFₜ / (1+TEM)<sup>t</sup></th>
                  </tr>
                </thead>
                <tbody>
                  {flujosDescontados.map((f) => (
                    <tr key={f.periodo} className="border-b">
                      <td className="py-1 pr-2">{f.periodo}</td>
                      <td className="py-1 pr-2 font-mono">{moneda} {Number(f.flujo).toFixed(2)}</td>
                      <td className="py-1 pr-2 font-mono">{Number(f.factor).toFixed(6)}</td>
                      <td className="py-1 pr-2 font-mono">{moneda} {Number(f.descontado).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 font-bold">
                    <td className="pt-2 pr-2">Total</td>
                    <td className="pt-2 pr-2" />
                    <td className="pt-2 pr-2" />
                    <td className="pt-2 pr-2">{moneda} {Number(van).toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* TIR */}
          <div>
            <h4 className="font-bold text-base mb-2">Tasa Interna de Retorno (TIR)</h4>
            <p className="text-xs text-gray-500 mb-3 font-mono">
              0 = Σ CFₜ / (1 + TIR)<sup>t</sup> &nbsp;—&nbsp; Método: bisección en [-99.99%, 1000%]
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-gray-50 rounded p-2">
                <p className="text-xs text-gray-500">TIR mensual</p>
                <p className="text-sm font-bold">{pct(tirMensual)}</p>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <p className="text-xs text-gray-500">TIR anual</p>
                <p className="text-sm font-bold">{pct(tirAnual)}</p>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <p className="text-xs text-gray-500">TCEA</p>
                <p className="text-sm font-bold">{pct(tcea)}</p>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <p className="text-xs text-gray-500">Iteraciones</p>
                <p className="text-sm font-bold">{tirPasos?.length || "-"}</p>
              </div>
            </div>

            {tirPasos && tirPasos.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Iteraciones de bisección:</p>
                <div className="overflow-x-auto max-h-64 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="pr-2">#</th>
                        <th className="pr-2">Low</th>
                        <th className="pr-2">High</th>
                        <th className="pr-2">Mid (TIR)</th>
                        <th className="pr-2">VAN(mid)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tirPasos.map((p) => (
                        <tr key={p.i} className="border-b hover:bg-gray-50">
                          <td className="py-1 pr-2">{p.i}</td>
                          <td className="py-1 pr-2 font-mono">{pct(p.low)}</td>
                          <td className="py-1 pr-2 font-mono">{pct(p.high)}</td>
                          <td className="py-1 pr-2 font-mono font-semibold">{pct(p.mid)}</td>
                          <td className="py-1 pr-2 font-mono">{moneda} {Number(p.npv).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

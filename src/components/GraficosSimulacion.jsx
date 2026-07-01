import { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  BarChart, Bar, Legend,
  AreaChart, Area
} from "recharts";

function currencyFormat(value, moneda) {
  if (value === null || value === undefined) return "-";
  return `${moneda} ${Number(value).toFixed(2)}`;
}

export function GraficosSimulacion({ cronograma, moneda, resumen }) {
  const saldoData = useMemo(() => {
    if (!cronograma || cronograma.length === 0) return [];
    return cronograma.map((r) => ({
      periodo: r.numeroCuota,
      "Saldo final": Number(r.saldoFinal),
      "Flujo total": Number(r.flujoTotal)
    }));
  }, [cronograma]);

  const composicionData = useMemo(() => {
    if (!cronograma || cronograma.length === 0) return [];
    return cronograma.map((r) => ({
      periodo: r.numeroCuota,
      Amortización: Number(r.amortizacion),
      Interés: Number(r.interes),
      Seguro: Number(r.seguro),
      Comisión: Number(r.comision),
      Gastos: Number(r.gastos)
    }));
  }, [cronograma]);

  const acumuladoData = useMemo(() => {
    if (!cronograma || cronograma.length === 0) return [];
    let intAcum = 0, amortAcum = 0;
    const totalPagado = resumen?.totalPagado || cronograma.reduce((s, r) => s + Number(r.flujoTotal), 0);
    return cronograma.map((r) => {
      intAcum += Number(r.interes);
      amortAcum += Number(r.amortizacion);
      return {
        periodo: r.numeroCuota,
        "Interés acumulado": intAcum,
        "Amortización acumulada": amortAcum,
        "% pagado": totalPagado > 0 ? Math.round((intAcum + amortAcum) / totalPagado * 100) : 0
      };
    });
  }, [cronograma, resumen]);

  if (!cronograma || cronograma.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Gráfico 1: Evolución del saldo */}
      <div className="card">
        <h4 className="font-bold text-base mb-2">Evolución del saldo</h4>
        <p className="text-xs text-gray-500 mb-3">Cómo disminuye la deuda período a período</p>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={saldoData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periodo" label={{ value: "Período", position: "insideBottom", offset: -5 }} fontSize={12} />
            <YAxis domain={[0, "auto"]} fontSize={12} tickFormatter={(v) => `${moneda} ${v}`} />
            <Tooltip formatter={(v) => currencyFormat(v, moneda)} />
            <Line type="monotone" dataKey="Saldo final" stroke="#6366f1" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico 2: Composición de cada cuota */}
      <div className="card">
        <h4 className="font-bold text-base mb-2">Composición de cada cuota</h4>
        <p className="text-xs text-gray-500 mb-3">Distribución del pago en cada período (interés, amortización, seguro, comisión, gastos)</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={composicionData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periodo" label={{ value: "Período", position: "insideBottom", offset: -5 }} fontSize={12} />
            <YAxis fontSize={12} tickFormatter={(v) => `${moneda} ${v}`} />
            <Tooltip formatter={(v) => currencyFormat(v, moneda)} />
            <Legend />
            <Bar dataKey="Amortización" stackId="a" fill="#22c55e" />
            <Bar dataKey="Interés" stackId="a" fill="#ef4444" />
            <Bar dataKey="Seguro" stackId="a" fill="#3b82f6" />
            <Bar dataKey="Comisión" stackId="a" fill="#f59e0b" />
            <Bar dataKey="Gastos" stackId="a" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico 3: Interés vs Amortización acumulados */}
      <div className="card">
        <h4 className="font-bold text-base mb-2">Interés vs Amortización acumulados</h4>
        <p className="text-xs text-gray-500 mb-3">Cuánto se ha pagado en intereses vs cuánto se ha amortizado del principal</p>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={acumuladoData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periodo" label={{ value: "Período", position: "insideBottom", offset: -5 }} fontSize={12} />
            <YAxis fontSize={12} tickFormatter={(v) => `${moneda} ${v}`} />
            <Tooltip formatter={(v) => currencyFormat(v, moneda)} />
            <Legend />
            <Area type="monotone" dataKey="Amortización acumulada" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} strokeWidth={2} />
            <Area type="monotone" dataKey="Interés acumulado" stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

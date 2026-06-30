import { Link } from "react-router-dom";

export function Dashboard() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
      <p className="text-gray-600 mb-6">Sistema para evaluar créditos vehiculares con Compra Inteligente.</p>

      <div className="grid grid-cols-3 gap-5 mb-8">
        <div className="card"><p className="text-sm text-gray-500">Método</p><h3 className="text-xl font-bold">Francés vencido</h3></div>
        <div className="card"><p className="text-sm text-gray-500">Monedas</p><h3 className="text-xl font-bold">Soles y dólares</h3></div>
        <div className="card"><p className="text-sm text-gray-500">Indicadores</p><h3 className="text-xl font-bold">VAN, TIR, TCEA</h3></div>
      </div>

      <div className="card">
        <h3 className="text-xl font-bold mb-3">Flujo recomendado</h3>
        <ol className="list-decimal ml-5 space-y-2 text-gray-700">
          <li>Registrar al cliente.</li>
          <li>Registrar el vehículo de interés.</li>
          <li>Configurar tasa, moneda, plazo, gracia y cuota balón.</li>
          <li>Generar cronograma e indicadores.</li>
        </ol>
        <Link to="/simulador" className="btn-primary inline-block mt-5">Nueva simulación</Link>
      </div>
    </div>
  );
}

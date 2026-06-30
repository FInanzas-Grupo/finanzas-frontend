import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";

const links = [
  ["/", "Dashboard"],
  ["/clientes", "Clientes"],
  ["/vehiculos", "Vehículos"],
  ["/simulador", "Simulador"],
  ["/historial", "Historial"]
];

export function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen">
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-950 text-white p-5">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">FINANCES</h1>
          <p className="text-sm text-slate-300">Compra Inteligente</p>
        </div>
        <nav className="space-y-2">
          {links.map(([href, label]) => (
            <NavLink
              key={href}
              to={href}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 ${isActive ? "bg-blue-700" : "hover:bg-slate-800"}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-5 left-5 right-5">
          <p className="text-sm text-slate-300 mb-2">{user?.nombre}</p>
          <button onClick={onLogout} className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700">
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}

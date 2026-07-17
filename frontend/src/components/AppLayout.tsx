import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import "./AppLayout.css";

export function AppLayout() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">SC</span>
          <div>
            <strong>SmartCatalog</strong>
            <p>Catálogo multi-tenant com IA</p>
          </div>
        </div>

        <nav className="app-nav">
          <NavLink to="/dashboard">Produtos</NavLink>
          <NavLink to="/chat">Chat</NavLink>
        </nav>

        <div className="app-user">
          <div>
            <strong>{user?.name}</strong>
            <p>
              {user?.email} · {isAdmin ? "admin" : "user"}
            </p>
          </div>
          <button type="button" onClick={logout}>
            Sair
          </button>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

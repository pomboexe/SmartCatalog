import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { ChatProvider } from "../features/chat/ChatContext";
import { ChatWidget } from "../features/chat/ChatWidget";
import { ThemeToggle } from "./ThemeToggle";

export function AppLayout() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <ChatProvider>
      <div className="app-shell">
        <header className="border-b border-ink/10 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal font-display text-sm font-extrabold text-mist">
                SC
              </span>
              <div>
                <p className="font-display text-lg font-bold tracking-tight text-ink">
                  SmartCatalog
                </p>
                <p className="text-sm text-ink-soft/70">
                  Catálogo multi-tenant com IA
                </p>
              </div>
            </div>

            <nav className="flex gap-2">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-teal/20 text-teal"
                      : "text-ink-soft hover:bg-ink/5"
                  }`
                }
              >
                Produtos
              </NavLink>
            </nav>

            <div className="flex items-center gap-3 lg:justify-end">
              <div className="text-left lg:text-right">
                <p className="text-sm font-semibold text-ink">{user?.name}</p>
                <p className="text-xs text-ink-soft/70">
                  {user?.email} · {isAdmin ? "admin" : "user"}
                </p>
              </div>
              <ThemeToggle />
              <button
                type="button"
                onClick={logout}
                className="rounded-xl border border-ink/12 bg-surface px-3.5 py-2 text-sm font-semibold text-ink transition hover:bg-mist"
              >
                Sair
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-6 py-8">
          <Outlet />
        </main>

        <ChatWidget />
      </div>
    </ChatProvider>
  );
}

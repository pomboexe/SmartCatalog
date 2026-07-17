import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

export function AuthLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-mist text-ink">
      <div className="auth-fade pointer-events-none absolute inset-0">
        <div className="auth-grid absolute inset-0" />
        <div className="absolute -left-24 top-[-10%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.22),transparent_65%)]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(11,31,42,0.1),transparent_70%)]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/70 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:px-10 lg:py-16">
        <section className="auth-rise max-w-xl">
          <p className="mb-5 font-display text-sm font-semibold tracking-[0.22em] text-teal uppercase">
            SmartCatalog
          </p>
          <h1 className="font-display text-5xl leading-[0.95] font-extrabold tracking-tight text-ink sm:text-6xl lg:text-7xl">
            O catálogo da sua
            <span className="block text-teal">empresa, com IA.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft/80">
            Cadastre produtos, isole dados por tenant e deixe o agente responder
            clientes com informações reais do banco.
          </p>
        </section>

        <section className="auth-rise-delay w-full max-w-md justify-self-end">
          <div className="rounded-2xl border border-ink/8 bg-white/80 p-7 shadow-[0_24px_60px_-32px_rgba(11,31,42,0.35)] backdrop-blur-md sm:p-8">
            <div key={location.pathname} className="auth-panel-swap">
              <Outlet />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

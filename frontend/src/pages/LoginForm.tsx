import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  authButtonClass,
  authFieldClass,
  authLabelClass,
} from "../features/auth/authStyles";
import { useLoginMutation } from "../features/auth/useAuthMutations";
import { ApiError } from "../services/api";

export function LoginForm() {
  const loginMutation = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    loginMutation.mutate({ email, password });
  }

  const errorMessage =
    loginMutation.error instanceof ApiError
      ? loginMutation.error.message
      : loginMutation.isError
        ? "Falha ao fazer login"
        : "";

  return (
    <>
      <div className="mb-7">
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
          Entrar
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft/75">
          Acesse o catálogo da sua empresa com segurança multi-tenant.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <label className={authLabelClass}>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={authFieldClass}
            autoComplete="email"
            required
          />
        </label>

        <label className={authLabelClass}>
          Senha
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={authFieldClass}
            autoComplete="current-password"
            required
          />
        </label>

        {errorMessage ? (
          <p className="rounded-lg bg-coral/10 px-3 py-2 text-sm text-coral">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          className={authButtonClass}
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Entrando..." : "Entrar no catálogo"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink-soft/75">
        Não tem conta?{" "}
        <Link
          to="/register"
          className="font-semibold text-teal underline-offset-4 hover:underline"
        >
          Criar empresa
        </Link>
      </p>
    </>
  );
}

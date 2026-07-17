import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  authButtonClass,
  authFieldClass,
  authLabelClass,
} from "../features/auth/authStyles";
import { useRegisterMutation } from "../features/auth/useAuthMutations";
import { ApiError } from "../services/api";

export function RegisterForm() {
  const registerMutation = useRegisterMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    registerMutation.mutate({ name, email, password, companyName });
  }

  const errorMessage =
    registerMutation.error instanceof ApiError
      ? registerMutation.error.message
      : registerMutation.isError
        ? "Falha ao criar conta"
        : "";

  return (
    <>
      <div className="mb-7">
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
          Criar empresa
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft/75">
          Registre o tenant e o primeiro admin. Seu catálogo nasce isolado.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <label className={authLabelClass}>
          Nome da empresa
          <input
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            className={authFieldClass}
            required
          />
        </label>

        <label className={authLabelClass}>
          Seu nome
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={authFieldClass}
            required
          />
        </label>

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
            autoComplete="new-password"
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
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Criando..." : "Criar catálogo"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink-soft/75">
        Já tem conta?{" "}
        <Link
          to="/login"
          className="font-semibold text-teal underline-offset-4 hover:underline"
        >
          Entrar
        </Link>
      </p>
    </>
  );
}

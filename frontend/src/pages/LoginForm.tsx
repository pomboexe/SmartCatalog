import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useLoginMutation } from "../features/auth/useAuthMutations";
import { ApiError } from "../services/api";

export function LoginForm() {
  const loginMutation = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent) {
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
        <Input
          label="E-mail"
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />

        <Input
          label="Senha"
          type="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />

        {errorMessage ? (
          <p className="rounded-lg bg-coral/10 px-3 py-2 text-sm text-coral">
            {errorMessage}
          </p>
        ) : null}

        <Button
          type="submit"
          className="mt-2 w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Entrando..." : "Entrar no catálogo"}
        </Button>
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

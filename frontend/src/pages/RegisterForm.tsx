import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useRegisterMutation } from "../features/auth/useAuthMutations";
import { ApiError } from "../services/api";

export function RegisterForm() {
  const registerMutation = useRegisterMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");

  function handleSubmit(event: FormEvent) {
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
        <Input
          label="Nome da empresa"
          name="companyName"
          value={companyName}
          onChange={(event) => setCompanyName(event.target.value)}
          required
        />

        <Input
          label="Seu nome"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

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
          autoComplete="new-password"
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
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Criando..." : "Criar catálogo"}
        </Button>
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

import { useAuth } from "../features/auth/AuthContext";

export function ChatPage() {
  const { user } = useAuth();

  return (
    <section className="space-y-4">
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
          Chat com IA
        </h1>
        <p className="mt-1 text-ink-soft/75">
          Pergunte sobre produtos da empresa de {user?.name}. O agente consulta
          o banco filtrando pelo seu companyId.
        </p>
      </div>

      <div className="rounded-2xl border border-ink/8 bg-surface-muted p-6 text-sm text-ink-soft/80">
        <p className="font-display text-base font-bold text-ink">Próximo passo</p>
        <p className="mt-2">
          Conectar `useSendChatMessage` e montar a interface de conversa.
        </p>
      </div>
    </section>
  );
}

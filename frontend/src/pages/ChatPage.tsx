import { useAuth } from "../features/auth/AuthContext";

export function ChatPage() {
  const { user } = useAuth();

  return (
    <section className="page">
      <h1>Chat com IA</h1>
      <p>
        Pergunte sobre produtos da empresa de {user?.name}. O agente consulta o
        banco filtrando pelo seu `companyId`.
      </p>

      <div className="placeholder-card">
        <strong>Próximo passo</strong>
        <p>
          Conectar `sendChatMessage` do `chatService` e montar a lista de
          mensagens.
        </p>
        <ul>
          <li>Input + botão enviar</li>
          <li>Histórico local de mensagens</li>
          <li>Chamar `POST /chat` com Bearer token</li>
        </ul>
      </div>
    </section>
  );
}

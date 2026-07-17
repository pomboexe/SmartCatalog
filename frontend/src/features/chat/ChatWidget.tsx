import { useEffect, useRef, useState, type FormEvent } from "react";
import { ApiError } from "../../services/api";
import { useChatPanel } from "./ChatContext";
import { useSendChatMessage } from "./useChat";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ChatWidget() {
  const { isOpen, close, toggle } = useChatPanel();
  const sendMessage = useSendChatMessage();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Olá! Posso ajudar com o catálogo da sua empresa. Pergunte sobre produtos, preços ou categorias.",
    },
  ]);
  const [error, setError] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isOpen, sendMessage.isPending]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const content = input.trim();
    if (!content || sendMessage.isPending) return;

    setError("");
    setInput("");
    setMessages((current) => [
      ...current,
      { id: createId(), role: "user", content },
    ]);

    try {
      const result = await sendMessage.mutateAsync(content);
      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: "assistant",
          content: result.reply,
        },
      ]);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Não foi possível enviar a mensagem.";
      setError(message);
    }
  }

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {isOpen ? (
        <div className="pointer-events-auto flex h-[min(32rem,calc(100vh-7rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-ink/10 bg-surface-muted shadow-[0_24px_60px_-24px_var(--shadow-panel)] backdrop-blur-md">
          <header className="flex items-center justify-between border-b border-ink/8 px-4 py-3">
            <div>
              <p className="font-display text-sm font-bold text-ink">
                Assistente
              </p>
              <p className="text-xs text-ink-soft/70">
                Consulta o catálogo da sua empresa
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Fechar chat"
              className="grid h-8 w-8 place-items-center rounded-lg text-ink-soft transition hover:bg-ink/5 hover:text-ink"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>

          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-3"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-teal text-mist"
                      : "border border-ink/8 bg-mist text-ink"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {sendMessage.isPending ? (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-ink/8 bg-mist px-3.5 py-2.5 text-sm text-ink-soft">
                  Pensando...
                </div>
              </div>
            ) : null}
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-ink/8 p-3"
          >
            {error ? (
              <p className="mb-2 rounded-lg bg-coral/10 px-3 py-2 text-xs text-coral">
                {error}
              </p>
            ) : null}

            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Pergunte sobre produtos..."
                disabled={sendMessage.isPending}
                className="min-w-0 flex-1 rounded-xl border border-ink/12 bg-mist px-3 py-2.5 text-sm text-ink outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20"
              />
              <button
                type="submit"
                disabled={sendMessage.isPending || !input.trim()}
                className="rounded-xl bg-ink px-3.5 py-2.5 text-sm font-bold text-mist transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-70"
              >
                Enviar
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        onClick={toggle}
        aria-label={isOpen ? "Fechar chat" : "Abrir chat"}
        className="pointer-events-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-teal text-mist shadow-[0_16px_40px_-12px_rgba(15,118,110,0.65)] transition hover:scale-105 active:scale-95"
      >
        {isOpen ? (
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
          </svg>
        )}
      </button>
    </div>
  );
}

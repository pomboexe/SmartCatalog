import { Router } from "express";
import { ChatWithAgentUseCase } from "../../application/use-cases/chat/ChatWithAgent";
import { JwtTokenService } from "../../infrastructure/security/JwtTokenService";
import { authMiddleware } from "../middlewares/auth";
import { AppError } from "../../shared/errors/AppError";

interface ChatRoutesDeps {
  chatWithAgent: ChatWithAgentUseCase;
  tokenService: JwtTokenService;
}

type SseEvent =
  | { type: "delta"; content: string }
  | { type: "done" }
  | { type: "error"; message: string };

function writeSse(res: import("express").Response, event: SseEvent): void {
  res.write(`data: ${JSON.stringify(event)}\n\n`);
  // Garante flush imediato (evita travar em "Pensando...")
  const flushable = res as import("express").Response & {
    flush?: () => void;
  };
  flushable.flush?.();
}

export function createChatRoutes(deps: ChatRoutesDeps): Router {
  const router = Router();
  const authenticate = authMiddleware(deps.tokenService);

  // Resposta completa (compatibilidade)
  router.post("/", authenticate, async (req, res, next) => {
    try {
      const { message } = req.body;

      if (!message || typeof message !== "string") {
        throw new AppError("message é obrigatório", 400);
      }

      const result = await deps.chatWithAgent.execute({
        message,
        companyId: req.user!.companyId,
      });

      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  });

  // Streaming via Server-Sent Events
  router.post("/stream", authenticate, async (req, res) => {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "message é obrigatório" });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders?.();

    // Importante: usar res.on("close"), NÃO req.on("close").
    // req "close" dispara ao terminar de ler o body e matava o stream.
    let closed = false;
    res.on("close", () => {
      closed = true;
    });

    try {
      await deps.chatWithAgent.executeStream(
        {
          message,
          companyId: req.user!.companyId,
        },
        {
          onToken: async (token) => {
            if (closed) return;
            writeSse(res, { type: "delta", content: token });
          },
        },
      );

      if (!closed) {
        writeSse(res, { type: "done" });
        res.end();
      }
    } catch (error) {
      console.error("[chat/stream]", error);

      const messageText =
        error instanceof AppError
          ? error.message
          : "Não foi possível consultar o assistente agora. Tente novamente.";

      if (!closed) {
        writeSse(res, { type: "error", message: messageText });
        res.end();
      }
    }
  });

  return router;
}

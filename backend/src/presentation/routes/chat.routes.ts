import { Router } from "express";
import { ChatWithAgentUseCase } from "../../application/use-cases/chat/ChatWithAgent";
import { JwtTokenService } from "../../infrastructure/security/JwtTokenService";
import { authMiddleware } from "../middlewares/auth";
import { AppError } from "../../shared/errors/AppError";

interface ChatRoutesDeps {
  chatWithAgent: ChatWithAgentUseCase;
  tokenService: JwtTokenService;
}

export function createChatRoutes(deps: ChatRoutesDeps): Router {
  const router = Router();
  const authenticate = authMiddleware(deps.tokenService);

  // Admin e user autenticados podem usar o chat
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

  return router;
}

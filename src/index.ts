import { handleHealth } from "./handlers/health";
import { handleTts } from "./handlers/tts";
import { handleVoices } from "./handlers/voices";
import { errorResponse, noContent, withCors } from "./lib/http";

async function routeRequest(request: Request, env: Env) {
  const { pathname } = new URL(request.url);

  // CORS preflight пропускаем без авторизации — иначе браузерные клиенты не смогут достучаться
  if (request.method === "OPTIONS") {
    return noContent();
  }

  
  if (pathname === "/health") {
    if (request.method !== "GET") {
      return errorResponse(405, "METHOD_NOT_ALLOWED", "method not allowed");
    }

    return handleHealth();
  }

  if (pathname === "/voices") {
    if (request.method !== "GET") {
      return errorResponse(405, "METHOD_NOT_ALLOWED", "method not allowed");
    }

    return handleVoices();
  }

  if (pathname === "/tts") {
    if (request.method !== "POST") {
      return errorResponse(405, "METHOD_NOT_ALLOWED", "method not allowed");
    }

    return handleTts(request);
  }

  return errorResponse(404, "NOT_FOUND", "route not found");
}

export default {
  async fetch(
    request: Request,
    env: Env,
    _ctx: ExecutionContext
  ): Promise<Response> {
    try {
      const response = await routeRequest(request, env);
      return withCors(response);
    } catch {
      return errorResponse(500, "INTERNAL_ERROR", "unexpected internal error");
    }
  },
} satisfies ExportedHandler<Env>;

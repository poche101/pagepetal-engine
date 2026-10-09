import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type ModelMessage, type UIMessage } from "ai";

import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "./run-id.ts";

export function createResponsesCall(
  request: Request,
  config: { baseURL: string; apiKey: string; model: string },
  messages: ModelMessage[],
  instructions?: string,
) {
  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createOpenAI({
    baseURL: `${config.baseURL.replace(/\/+$/, "").replace(/\/v1$/, "")}/v1`,
    apiKey: config.apiKey,
    headers: { "Lovable-API-Key": config.apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });
  const reasoning = config.model !== "openai/chat-latest";
  const result = streamText({
    model: provider.responses(config.model),
    // AI SDK 6 lacks `instructions`: rename this key to `system` there.
    ...(instructions ? { instructions } : {}),
    messages,
    abortSignal: request.signal,
    maxRetries: 0,
    providerOptions: {
      openai: {
        store: false,
        ...(reasoning
          ? {
              forceReasoning: true,
              reasoningEffort: "medium",
              reasoningSummary: "auto",
              include: ["reasoning.encrypted_content"],
            }
          : {}),
      },
    },
  });
  return {
    result,
    responseWithHistory: (messages: UIMessage[], save: (messages: UIMessage[]) => Promise<void>, block: (message: string) => Promise<void>) =>
      withLovableAiGatewayRunIdHeader(result.toUIMessageStreamResponse({ originalMessages: messages, sendReasoning: true, onFinish: async ({ messages }) => { await save(messages); }, onError: (error) => { const e = error as { statusCode?: number; message?: string; responseBody?: string }; let message = e.message || "The assistant is unavailable. Please contact our team."; try { const b = JSON.parse(e.responseBody || "{}"); message = b.error?.message || b.message || message; } catch { /* preserve safe message */ } if (e.statusCode === 402 || e.statusCode === 403) void block(message); return message; } }), runIdFetch),
    response: () =>
      withLovableAiGatewayRunIdHeader(result.toUIMessageStreamResponse({ sendReasoning: true }), runIdFetch),
  };
}

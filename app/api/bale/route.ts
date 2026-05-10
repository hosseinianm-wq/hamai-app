import { NextRequest, NextResponse } from "next/server";
import baleService from "@/features/chat/services/bale_service";

const ACTIONS = {
  GET_UPDATES: "getUpdates",
  SEND_MESSAGE: "sendMessage",
  GET_CHAT: "getChat",
} as const;

type Action = (typeof ACTIONS)[keyof typeof ACTIONS];

function response(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

function error(message: string, status = 400) {
  return response({ success: false, error: message }, status);
}

export async function POST(req: NextRequest) {
  try {
    const { action, payload = {} } = await req.json();

    if (!Object.values(ACTIONS).includes(action)) {
      return error("Invalid action");
    }

    // ======================
    // GET UPDATES
    // ======================
    if (action === ACTIONS.GET_UPDATES) {
      const updates = await baleService.getUpdates(payload.limit ?? 20);

      return response({
        success: true,
        updates,
        count: updates.length,
      });
    }

    // ======================
    // SEND MESSAGE
    // ======================
    if (action === ACTIONS.SEND_MESSAGE) {
      const { chatId, text, replyTo } = payload;

      if (!chatId || !text) {
        return error("chatId and text required");
      }

      const result = await baleService.sendMessage(
        chatId,
        text,
        replyTo
      );

      return response({
        success: true,
        message: result,
      });
    }

    // ======================
    // GET CHAT
    // ======================
    if (action === ACTIONS.GET_CHAT) {
      const { chatId } = payload;

      if (!chatId) {
        return error("chatId required");
      }

      const chat = await baleService.getChat(chatId);

      return response({
        success: true,
        chat,
      });
    }

    return error("Unknown action", 400);
  } catch (err: any) {
    console.error("Bale API Error:", err);

    return error(err?.message || "Server error", 500);
  }
}
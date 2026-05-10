// features/chat/services/bale_service.ts
export interface BaleMessage {
  message_id: number;
  from?: {
    id: number;
    first_name: string;
    username?: string;
  };
  chat: {
    id: number;
    type: "private" | "group" | "supergroup" | "channel";
    title?: string;
    first_name?: string;
    username?: string;
  };
  text?: string;
  date: number;
  reply_to_message?: BaleMessage;
}

export interface BaleUpdate {
  update_id: number;
  message?: BaleMessage;
  edited_message?: BaleMessage;
}

export interface BaleChat {
  id: number;
  type: string;
  title?: string;
  first_name?: string;
  username?: string;
  unread_count?: number;
}

/**
 * سرویس امن ارتباط با Bale Bot API
 * تمام درخواست‌ها از طریق API Route سرور (/api/bale) انجام می‌شود
 */
class BaleService {
  private offset: number = 0;
  private isPolling: boolean = false;

  private async apiRequest<T>(
    action: string,
    payload: Record<string, any> = {}
  ): Promise<T> {
    const baseUrl =
      typeof window !== "undefined"
        ? ""
        : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/bale`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action,
        payload,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP Error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "خطای ناشناخته در Bale API");
    }

    return data;
  }

  /**
   * دریافت پیام‌های جدید
   */
  async getUpdates(limit: number = 15): Promise<BaleUpdate[]> {
    try {
      const result = await this.apiRequest<{ updates: BaleUpdate[] }>("getUpdates", { limit });

      const updates = result.updates || [];

      if (updates.length > 0) {
        this.offset = updates[updates.length - 1].update_id + 1;
      }

      return updates;
    } catch (error) {
      console.error("❌ Bale getUpdates error:", error);
      throw error;
    }
  }

  /**
   * ارسال پیام به چت
   */
  async sendMessage(chatId: number, text: string, replyTo?: number) {
    try {
      const result = await this.apiRequest<{ message: any }>("sendMessage", {
        chatId,
        text,
        replyTo,
      });
      return result.message;
    } catch (error) {
      console.error("❌ Bale sendMessage error:", error);
      throw error;
    }
  }

  /**
   * دریافت اطلاعات چت
   */
  async getChat(chatId: number): Promise<BaleChat> {
    try {
      const result = await this.apiRequest<{ chat: BaleChat }>("getChat", { chatId });
      return result.chat;
    } catch (error) {
      console.error("❌ Bale getChat error:", error);
      throw error;
    }
  }

  /**
   * شروع Polling (برای استفاده در background - آینده)
   */
  startPolling(
    callback: (updates: BaleUpdate[]) => void,
    interval: number = 1600
  ) {
    if (this.isPolling) return;

    this.isPolling = true;

    const poll = async () => {
      if (!this.isPolling) return;

      try {
        const updates = await this.getUpdates(15);
        if (updates.length > 0) {
          callback(updates);
        }
      } catch (error) {
        console.error("Polling error:", error);
        await new Promise((r) => setTimeout(r, 4000));
      }

      setTimeout(poll, interval);
    };

    poll();
  }

  stopPolling() {
    this.isPolling = false;
  }

  resetOffset() {
    this.offset = 0;
  }
}

// Singleton
export const baleService = new BaleService();
export default baleService;
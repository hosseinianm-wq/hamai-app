export interface BaleMessage {
  chat_id: number
  text?: string
  from?: {
    id: number
  }
}

export interface BaleSendMessagePayload {
  chat_id: number
  text: string
}

export interface BaleWebhookBody {
  message?: {
    chat?: {
      id: number
    }
    from?: {
      id: number
    }
    text?: string
  }
}

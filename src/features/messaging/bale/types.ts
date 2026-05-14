export type BaleUser = {
  id: number
}

export type BaleMessage = {
  message_id: number
  chat_id: number
  text?: string
  from?: BaleUser
}

export type BaleUpdate = {
  message?: BaleMessage
}

type EventHandler = (payload?: any) => void

export class VoiceEventBus {

  private listeners: Map<string, EventHandler[]> = new Map()

  on(event: string, handler: EventHandler) {

    const handlers = this.listeners.get(event) || []
    handlers.push(handler)

    this.listeners.set(event, handlers)
  }

  emit(event: string, payload?: any) {

    const handlers = this.listeners.get(event)

    if (!handlers) return

    for (const handler of handlers) {
      handler(payload)
    }

  }

  off(event: string, handler: EventHandler) {

    const handlers = this.listeners.get(event)
    if (!handlers) return

    this.listeners.set(
      event,
      handlers.filter(h => h !== handler)
    )
  }

}

import "./server/socket"

export default {
  async fetch(request: Request): Promise<Response> {

    return new Response("HamAI Worker is running 🚀")

  }
}

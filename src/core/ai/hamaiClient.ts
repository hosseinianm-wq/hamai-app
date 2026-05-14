// features/messaging/bale/hamaiClient.ts
type AskHamAIParams = {
  message: string
  userId?: number
  source?: string
  drivingMode?: boolean
  history?: {
    role: string
    content: string
  }[]
}

export async function askHamAI(
  params: AskHamAIParams
): Promise<string> {

  const {
    message,
    drivingMode
  } = params

  /*
   |--------------------------------------------------------------------------
   | Mock AI
   |--------------------------------------------------------------------------
   */

  if (drivingMode) {

    return `🚗 حالت رانندگی فعال شد.

پیام دریافت شد:
${message}`
  }

  return `🤖 گفتی:

${message}`
}

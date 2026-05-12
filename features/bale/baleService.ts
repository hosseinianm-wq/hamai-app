// features/bale/baleService.ts

const BALE_API = "https://tapi.bale.ai/bot";

export async function getUpdates(limit = 20) {
  const token = process.env.BALE_BOT_TOKEN;
  if (!token) throw new Error("BALE_BOT_TOKEN is not set");

  const url = `${BALE_API}${token}/getUpdates?limit=${limit}&timeout=10`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.ok) {
    throw new Error(data.description || "Failed to get updates from Bale");
  }

  return data.result;
}
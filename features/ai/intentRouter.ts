export function routeIntent(text: string) {
  const t = text.toLowerCase();

  if (t.includes("توقف")) return "stop";
  if (t.includes("ادامه")) return "resume";
  if (t.includes("بروزرسانی")) return "refresh";

  return "chat";
}
export function cleanText(input: string): string {
  if (!input) return ""

  let text = input

  // حذف لینک‌ها
  text = text.replace(/https?:\/\/\S+/g, "")

  // اصلاح حروف عربی به فارسی
  text = text.replace(/ي/g, "ی").replace(/ك/g, "ک")

  // حذف کاراکترهای اضافی
  text = text.replace(/[^\p{L}\p{N}\s.,!?؟،]/gu, "")

  // حذف فاصله‌های اضافی
  text = text.replace(/\s+/g, " ").trim()

  return text
}

// open-next.config.ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
// import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache";

export default defineCloudflareConfig({
  // اگر ردیف بعدی نیاز داری، uncomment کن
  // incrementalCache: r2IncrementalCache,

  // تنظیمات دلخواه تو اینجا می‌نویسی
});

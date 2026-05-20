// features/reader/urlReader.ts

import * as cheerio from "cheerio";

export async function extractUrlContent(
  url: string
): Promise<string> {

  try {

    const response = await fetch(url);

    const html = await response.text();

    const $ = cheerio.load(html);

    const text = $("body")
      .text()
      .replace(/\s+/g, " ")
      .trim();

    return text.slice(0, 12000);

  } catch (error) {

    console.error(
      "[URL_READER_ERROR]",
      error
    );

    return url;
  }
}

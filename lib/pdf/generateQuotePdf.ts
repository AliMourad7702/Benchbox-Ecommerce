import puppeteer from "puppeteer";
import Puppeteer from "puppeteer";

export async function generateQuotePdf(quoteId: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/quote-template/${quoteId}`;

  await page.goto(url, { waitUntil: "networkidle0" });

  const pdf = await page.pdf({
    format: "A4",
  });

  await browser.close();
  return Buffer.from(pdf);
}

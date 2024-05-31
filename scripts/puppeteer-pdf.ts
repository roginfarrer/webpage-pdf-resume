import puppeteer from "puppeteer";
import data from "../src/data.json";

export async function createPdf(
  port: string,
  log: (message: string) => void = console.log,
  debug: (message: string) => void = console.log,
) {
  if (!port) {
    throw new Error("Missing port");
  }

  let browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();

  debug(`opening page at port: ${port}`);
  await page.goto(`http://localhost:${port}/`, { waitUntil: "networkidle2" });

  const path = `public/${data.meta.name.toLowerCase().replaceAll(" ", "-")}-resume.pdf`;
  await page.pdf({ path });
  log(`Created ${path}`);

  await browser.close();
}

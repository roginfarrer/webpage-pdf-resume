import puppeteer from "puppeteer";
import data from "../src/data.json";

export async function createPdf(port: string) {
  if (!port) {
    throw new Error("Missing port");
  }

  let browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();

  console.log(`opening page at port: ${port}`);
  await page.goto(`http://localhost:${port}/`, { waitUntil: "networkidle2" });

  await page.pdf({
    path: `public/${data.meta.name.toLowerCase().replaceAll(" ", "-")}-resume.pdf`,
  });
  console.log("pdf created");

  await browser.close();
}

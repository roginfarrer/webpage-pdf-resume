import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import puppeteer from "puppeteer";

export async function getStaticPaths() {
  const letters = await getCollection("letters");
  return letters.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

export const GET: APIRoute = async ({ request, params }) => {
  try {
    let browser = await puppeteer.launch({
      ignoreHTTPSErrors: true,
      timeout: 15000,
    });
    const page = await browser.newPage();

    console.log(`Attempting to create PDF for ${request.url}`);

    await page.goto(`http://localhost:4321/letters/${params.slug}`, {
      waitUntil: "networkidle2",
    });

    let buffer = await page.pdf({ timeout: 15000 });

    console.log("PDF created.");

    for (let _page of await browser.pages()) {
      await _page.close();
    }
    await browser.close();

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
      },
    });
  } catch (e: any) {
    return new Response(null, {
      status: 404,
      statusText: e.message,
    });
  }
};

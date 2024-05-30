import { defineConfig } from "astro/config";

import devOnlyRoutes from "./astro-integrations/astro-dev-only-routes";
import { createPdf } from "./scripts/puppeteer-pdf";

const PORT = "6868";

async function watchChange(filename) {
  if (filename.includes("src/pages/index.astro")) {
    this.info("Recreating resume pdf");
    await createPdf(6868);
  }
}

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [
      {
        name: "create-resume-pdf",
        watchChange,
      },
    ],
  },
  integrations: [
    devOnlyRoutes(),
    {
      name: "create-resume-pdf",
      hooks: {
        "astro:server:start": async ({ address: { port }, logger }) => {
          logger.info("Creating PDF of resume...");
          await createPdf(port);
          logger.info("PDF created.");
        },
      },
    },
  ],
});

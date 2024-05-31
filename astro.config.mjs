import { defineConfig } from "astro/config";

import devOnlyRoutes from "./astro-integrations/astro-dev-only-routes";
import { createPdf } from "./scripts/puppeteer-pdf";
import pDebounce from "p-debounce";

/** @type {string} */
let PORT;
/** @type {import('astro').AstroIntegrationLogger} */
let externalLogger;

let debouncedCreatePdf = pDebounce(async () => {
  try {
    await createPdf(
      PORT,
      (msg) => externalLogger.info(msg),
      (msg) => externalLogger.debug(msg),
    );
  } catch (e) {
    externalLogger.error("Failed to create resume PDF. Error:");
    // @ts-ignore
    externalLogger.error(e.message);
  }
}, 1000);

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [
      {
        name: "create-resume-pdf",
        watchChange: async function (filename) {
          if (filename.includes("src/pages/index.astro")) {
            await debouncedCreatePdf();
          }
        },
      },
    ],
  },
  integrations: [
    devOnlyRoutes(),
    {
      name: "create-resume-pdf",
      hooks: {
        "astro:server:start": async ({ address: { port }, logger }) => {
          externalLogger = logger;
          PORT = port.toString();
          try {
            await createPdf(
              PORT,
              (message) => logger.info(message),
              (msg) => logger.debug(msg),
            );
          } catch (e) {
            logger.error("Failed to create resume PDF. Error:");
            // @ts-ignore
            logger.error(e.message);
          }
        },
      },
    },
  ],
});

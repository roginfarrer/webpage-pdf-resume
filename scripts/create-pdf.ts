import { parseArgs } from "node:util";
import * as cp from "node:child_process";
import treeKill from "tree-kill";
import { createPdf } from "./puppeteer-pdf";

interface Arguments {
  debug?: boolean;
  logger: Console;
}

let proc: cp.ChildProcessWithoutNullStreams;

async function startServer({
  logger,
}: Arguments): Promise<[cp.ChildProcessWithoutNullStreams, string]> {
  try {
    let port = "4600";
    proc = cp.spawn("bun", ["dev", "--port", port]);
    await new Promise<void>((resolve) => {
      proc.on("spawn", () => {
        logger.log("bun dev server started");
      });

      proc.stdout.on("data", (data) => {
        if (data.toString().includes("http://localhost:")) {
          let matches = /http:\/\/localhost:(\d{4})/.exec(
            data.toString() as string,
          );
          if (matches) {
            logger.log("found dev server created a port: ", matches[1]);
            port = matches[1];
          }
          resolve();
        }
      });
    });

    return [proc, port];
  } catch (e) {
    throw e;
  }
}

(async () => {
  const { values } = parseArgs({
    options: {
      debug: {
        type: "boolean",
      },
    },
  });
  let logger = new Proxy(console, {
    get() {
      if (values.debug) {
        // @ts-expect-error
        return Reflect.get(...arguments);
      }
      return () => {};
    },
  });

  let port;
  [proc, port] = await startServer({ logger });
  await createPdf(port);
  await cleanup();
})();

async function cleanup() {
  console.log("Cleaning up...");
  await new Promise<void>((resolve) => {
    if (proc) {
      proc.on("close", (code) => {
        console.log(`Subprocess exited with code ${code}`);
        resolve();
      });
      treeKill(proc.pid!);
    } else {
      resolve();
    }
  });
}
async function handleExit(signal: string) {
  console.log(`${signal} received, terminating subprocess...`);
  await cleanup();
  process.exit(0);
}
process.on("SIGINT", () => handleExit("SIGINT"));
process.on("SIGTERM", () => handleExit("SIGTERM"));
process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await cleanup();
  process.exit(1);
});

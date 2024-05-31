/**
 * Copyright 2022 White Pine Studio, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * Modified version of https://github.com/MoustaphaDev/astro-dev-only-routes
 * Original didn't support *.ts files, which is needed to create PDFs
 * of cover letters
 */

import { fileURLToPath } from "url";
import { globbySync } from "globby";
import kleur from "kleur";
import path from "path";
import slash from "slash";
import type { AstroIntegration } from "astro";

// const pageExtRE = /\.(astro|mdx|md|tsx|ts|jsx|js)$/; Support later
const pageExtRE = /\.(astro|ts)$/;
const DOUBLE_UNDERSCORE = "__";
export default function integration(): AstroIntegration {
  return {
    name: "astro-dev-only-routes",
    hooks: {
      // TODO: handle refresh when new routes are created or deleted
      "astro:config:setup": ({ injectRoute, config, command }) => {
        if (command === "build") {
          return;
        }
        let pagesDir = new URL("./src/pages", config.root);

        // TODO: support .mdx, .md, .ts, .js
        const devOnlyFiles = globbySync(
          [
            `**/${DOUBLE_UNDERSCORE}*.{astro,ts}`,
            `**/${DOUBLE_UNDERSCORE}*/**/*.{astro,ts}`,
          ],
          {
            cwd: pagesDir,
          },
        );
        if (devOnlyFiles.length === 0) {
          log("warn", "No dev-only routes found.");
          return;
        }
        const devOnlyRoutes = devOnlyFiles.map((route) => {
          const firstIndexOfDoubleUnderscore = route.indexOf(DOUBLE_UNDERSCORE);

          const pagesDirRelativePath = route.slice(
            0,
            firstIndexOfDoubleUnderscore,
          );
          const routePath = route.slice(
            firstIndexOfDoubleUnderscore + DOUBLE_UNDERSCORE.length,
          );
          // .replace(pageExtRE, "");

          return { routePath, pagesDirRelativePath };
        });

        for (let { routePath, pagesDirRelativePath } of devOnlyRoutes) {
          // BUG in astro: deeply nested index.astro routes collide with root index.astro
          // Open an issue
          // const filename = routePath.slice(
          //     routePath.lastIndexOf('/') + 1
          // );
          // if (filename === 'index') {
          //     filename = ''
          // }
          const entryPoint = slash(
            path.join(
              fileURLToPath(pagesDir),
              `${DOUBLE_UNDERSCORE}${routePath}`,
            ),
          );
          const pattern = slash(
            path.join(pagesDirRelativePath, routePath.replace(pageExtRE, "")),
          );

          injectRoute({
            entrypoint: entryPoint,
            pattern,
          });
        }

        const devOnlyRoutesCount = devOnlyRoutes.length;
        const devOnlyRoutesTreeView = createTreeView(
          foldersToConsumableTree(devOnlyFiles),
        );
        log(
          "info",
          `Found ${devOnlyRoutesCount} dev-only route${
            devOnlyRoutesCount > 1 ? "s" : ""
          }. Here they are:\n${kleur.bold(devOnlyRoutesTreeView)}`,
        );
      },
    },
  };
}

function log(
  type: "info" | "warn" | "error",
  message: string,
  silent: boolean = false,
) {
  if (silent) return;
  const date = new Date().toLocaleTimeString();
  const bgColor =
    type === "error"
      ? kleur.bgRed
      : type === "warn"
        ? kleur.bgYellow
        : kleur.bgMagenta;
  type === "error";
  console.log(
    `${kleur.gray(date)}\n${bgColor(
      kleur.bold("[astro-dev-only-routes]"),
    )} ${message}`,
  );
}

function foldersToConsumableTree(folders: string[]) {
  const tree = {};
  for (let folder of folders) {
    const parts = folder.split(path.sep);
    const rootKey = parts.shift();
    if (!rootKey) {
      continue;
    }
    addNestedKeys(tree, [rootKey, ...parts]);
  }
  return tree;
}

function addNestedKeys(obj: object, keys: string[]) {
  let cursor = obj;
  for (let key of keys) {
    // @ts-ignore
    cursor[key] = cursor[key] || {};
    // @ts-ignore
    cursor = cursor[key];
  }
}

// TODO: make this
// @ts-ignore
function createTreeView(tree, indent = 0) {
  const BRANCH = kleur.magenta("├─");
  const HALF_BRANCH = kleur.magenta("└─");
  const DOWN_TRIANGLE = "▼";

  let result = "";
  const keys = Object.keys(tree);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = tree[key];
    const isLastKey = i === keys.length - 1;
    const maybeDownTriangle = isDir(value) ? DOWN_TRIANGLE : " ";
    const padding = "   ".repeat(indent);
    const branch = isLastKey ? HALF_BRANCH : BRANCH;
    result += `${padding} ${branch} ${maybeDownTriangle} ${key}\n`;
    if (typeof value === "object") {
      result += createTreeView(value, indent + 1);
    } else {
      result += `${padding}${branch} ${value}\n`;
    }
  }
  return result;
}

// @ts-ignore
function isDir(tree) {
  return Object.keys(tree).length > 0;
}

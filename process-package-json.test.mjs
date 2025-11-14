/* eslint-disable qunit/require-expect */
import { expect, test } from "vitest";
import processPackageJson from "./process-package-json.js";

test("types field", () => {
  expect(processPackageJson({ types: "index.d.ts" })).toMatchInlineSnapshot(`
    Map {
      "." => "index.d.ts",
    }
  `);
});

test("typings field", () => {
  expect(processPackageJson({ typings: "./moment.d.ts" }))
    .toMatchInlineSnapshot(`
    Map {
      "." => "./moment.d.ts",
    }
  `);
});

test("exports field", () => {
  expect(
    processPackageJson({
      exports: {
        ".": {
          types: "./dist/types/photoswipe.d.ts",
          default: "./dist/photoswipe.esm.js",
        },
        "./lightbox": {
          types: "./dist/types/lightbox/lightbox.d.ts",
          default: "./dist/photoswipe-lightbox.esm.js",
        },
        "./dist/photoswipe.css": "./dist/photoswipe.css",
        "./photoswipe.css": "./dist/photoswipe.css",
        "./style.css": "./dist/photoswipe.css",
      },
    })
  ).toMatchInlineSnapshot(`
    Map {
      "." => "./dist/types/photoswipe.d.ts",
      "./lightbox" => "./dist/types/lightbox/lightbox.d.ts",
    }
  `);
});

test("deep exports field", () => {
  expect(
    processPackageJson({
      exports: {
        "./package.json": "./package.json",
        ".": {
          "react-native": {
            types: "./dist/immer.d.ts",
            default: "./dist/immer.legacy-esm.js",
          },
          import: {
            types: "./dist/immer.d.ts",
            default: "./dist/immer.mjs",
          },
          require: {
            types: "./dist/immer.d.ts",
            default: "./dist/cjs/index.js",
          },
        },
      },
    })
  ).toMatchInlineSnapshot(`
    Map {
      "." => "./dist/immer.d.ts",
    }
  `);
});

test("exports field with wildcards", () => {
  expect(
    processPackageJson({
      exports: {
        ".": {
          types: "./types/index.d.ts",
          default: "./dist/index.js",
        },
        "./*": {
          types: "./types/*.d.ts",
          default: "./dist/*.js",
        },
        "./addon-main.js": "./addon-main.cjs",
      },
    })
  ).toMatchInlineSnapshot(`
    Map {
      "." => "./types/index.d.ts",
      "./*" => "./types/*.d.ts",
    }
  `);
});

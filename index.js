/* eslint-disable no-console */
import { readFileSync } from "node:fs";
import processDts from "./process-dts.js";

const packageName = process.argv[2];
let packageJson;
try {
  packageJson = JSON.parse(
    readFileSync(`./node_modules/${packageName}/package.json`, "utf-8")
  );
} catch {
  console.error(`Package '${packageName}' not found`);
  process.exit(1);
}

const dtsPaths = new Map();

if (packageJson["types"]) {
  dtsPaths.set(".", packageJson["types"]);
}

if (packageJson["typings"]) {
  dtsPaths.set(".", packageJson["typings"]);
}

if (packageJson["exports"]) {
  for (const [name, entry] of Object.entries(packageJson["exports"])) {
    if (entry.types) {
      dtsPaths.set(name, entry.types);
    }
  }
}

// TODO: handle structures like:
// "exports": {
//   "./package.json": "./package.json",
//   ".": {
//     "react-native": {
//       "types": "./dist/immer.d.ts",
//       "default": "./dist/immer.legacy-esm.js"
//     },
//     "import": {
//       "types": "./dist/immer.d.ts",
//       "default": "./dist/immer.mjs"
//     },
//     "require": {
//       "types": "./dist/immer.d.ts",
//       "default": "./dist/cjs/index.js"
//     }
//   }
// },

for (const [name, path] of dtsPaths) {
  const source = readFileSync(`./node_modules/${packageName}/${path}`, "utf-8");

  const reexports = processDts(packageName, name, source);
  if (reexports) {
    console.log(reexports);
  }
}

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

for (const [name, path] of dtsPaths) {
  const source = readFileSync(`./node_modules/${packageName}/${path}`, "utf-8");

  processDts(packageName, name, source);
}

/* eslint-disable no-console */
import { readFileSync } from "node:fs";
import processDts from "./process-dts.js";
import processPackageJson from "./process-package-json.js";

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

const dtsPaths = processPackageJson(packageJson);

for (const [name, path] of dtsPaths) {
  const source = readFileSync(`./node_modules/${packageName}/${path}`, "utf-8");

  const reexports = processDts(packageName, name, source);
  if (reexports) {
    console.log(reexports);
  }
}

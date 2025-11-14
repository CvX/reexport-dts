/* eslint-disable no-console */
import { globSync, readFileSync } from "node:fs";
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

const expandedDtsPaths = new Map();
for (const [name, path] of dtsPaths) {
  if (path.includes("*")) {
    const entries = globSync(path.replace("*", "**/*"), {
      cwd: `./node_modules/${packageName}`,
    });

    const prefix = path.replace(/\*\.d\.ts$/, "");
    const prefixToRemove = new RegExp(`^${prefix}`);

    for (const entry of entries) {
      const expandedName = entry
        .replace(prefixToRemove, "./")
        .replace(/\.d\.ts$/, "")
        .replace(/\/index$/, "");

      expandedDtsPaths.set(
        expandedName,
        `./node_modules/${packageName}/${entry}`
      );
    }
  } else {
    expandedDtsPaths.set(name, `./node_modules/${packageName}/${path}`);
  }
}

for (const [name, path] of expandedDtsPaths) {
  let source;
  try {
    source = readFileSync(path, "utf-8");
  } catch {
    continue;
  }

  const reexports = processDts(packageName, name, source);
  if (reexports) {
    console.log(reexports);
  }
}

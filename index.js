/* eslint-disable no-console */
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
import { readFileSync } from "node:fs";

const traverse = traverseModule.default;

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

function processDts(name, dtsPath) {
  const source = readFileSync(
    `./node_modules/${packageName}/${dtsPath}`,
    "utf-8"
  );

  const ast = parse(source, {
    sourceType: "module",
    plugins: [["typescript", { dts: true }]],
  });

  const exports = new Set();

  // TODO: handle `declare` stuff (see: moment.js)
  traverse(ast, {
    ExportNamedDeclaration(path) {
      if (path.node.exportKind === "value") {
        for (const node of path.node.specifiers) {
          exports.add(node.exported.name);
        }

        if (path.node.declaration?.type === "ClassDeclaration") {
          exports.add(path.node.declaration.id.name);
        }
      } else if (path.node.exportKind === "type") {
        exports.add(path.node.declaration.id.name);
      }
    },
    ExportDefaultDeclaration() {
      exports.add("default");
    },
  });

  if (exports.length === 0) {
    return;
  }

  console.log(`declare module "${packageName}${name.substring(1)}" {`);
  console.log("  export {");

  for (const entry of exports) {
    console.log(`    ${entry},`);
  }

  console.log(
    `  } from "@types/${packageName
      .replace(/^@/, "")
      .replace("/", "__")}${name.substring(1)}";`
  );
  console.log("}\n");
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
  processDts(name, path);
}

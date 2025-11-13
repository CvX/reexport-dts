/* eslint-disable no-console */
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";

const traverse = traverseModule.default;

export default function processDts(packageName, pathName, dtsFile) {
  const ast = parse(dtsFile, {
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

  console.log(`declare module "${packageName}${pathName.substring(1)}" {`);
  console.log("  export {");

  for (const entry of exports) {
    console.log(`    ${entry},`);
  }

  console.log(
    `  } from "@types/${packageName
      .replace(/^@/, "")
      .replace("/", "__")}${pathName.substring(1)}";`
  );
  console.log("}\n");
}

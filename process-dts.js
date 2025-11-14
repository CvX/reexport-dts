import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";

const traverse = traverseModule.default || traverseModule;

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

        if (
          path.node.declaration?.type === "ClassDeclaration" ||
          path.node.declaration?.type === "TSEnumDeclaration"
        ) {
          exports.add(path.node.declaration.id.name);
        }

        if (path.node.declaration?.type === "VariableDeclaration") {
          for (const declaration of path.node.declaration.declarations) {
            exports.add(declaration.id.name);
          }
        }
      } else if (path.node.exportKind === "type") {
        exports.add(path.node.declaration.id.name);
      }
    },
    ExportDefaultDeclaration() {
      exports.add("default");
    },
  });

  if (exports.size === 0) {
    return;
  }

  let output = "";
  output += `declare module "${packageName}${pathName.substring(1)}" {\n`;
  output += "  export {\n";

  for (const entry of exports) {
    output += `    ${entry},\n`;
  }

  const originalPath =
    "@types/" +
    packageName.replace(/^@/, "").replace("/", "__") +
    pathName.substring(1);

  output += `  } from "${originalPath}";\n`;
  output += "}\n";

  return output;
}

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
          path.node.declaration?.type === "TSEnumDeclaration" ||
          path.node.declaration?.type === "TSDeclareFunction"
        ) {
          exports.add(path.node.declaration.id.name);
        }

        if (path.node.declaration?.type === "VariableDeclaration") {
          for (const declaration of path.node.declaration.declarations) {
            exports.add(declaration.id.name);
          }
        }
      } else if (path.node.exportKind === "type") {
        if (path.node.declaration?.type === "VariableDeclaration") {
          for (const declaration of path.node.declaration.declarations) {
            exports.add(declaration.id.name);
          }
        } else if (path.node.declaration?.id?.name) {
          exports.add(path.node.declaration.id.name);
        } else {
          for (const specifier of path.node.specifiers) {
            exports.add(specifier.exported.name);
          }
        }
      }
    },
    ExportDefaultDeclaration() {
      exports.add("default");
    },
  });

  if (exports.size === 0) {
    return;
  }

  let moduleName = packageName;
  if (pathName !== ".") {
    moduleName += `/${pathName}`;
  }

  let output = "";
  output += `declare module "${moduleName}" {\n`;
  output += "  export {\n";

  for (const entry of exports) {
    output += `    ${entry},\n`;
  }

  let originalPathParts = [
    "@types",
    packageName.replace(/^@/, "").replace("/", "__"),
  ];

  if (pathName !== ".") {
    originalPathParts.push(pathName);
  }

  const originalPath = originalPathParts.join("/");

  output += `  } from "${originalPath}";\n`;
  output += "}\n";

  return output;
}

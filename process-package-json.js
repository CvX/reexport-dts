export default function processPackageJson(packageJson) {
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

  return dtsPaths;

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
}

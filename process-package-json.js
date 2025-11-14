import { compareVersions } from "compare-versions";

export default function processPackageJson(packageJson) {
  const dtsPaths = new Map();

  // sometimes there is a index.d.ts and no package.json entries...
  dtsPaths.set(".", "index.d.ts");

  if (packageJson["types"]) {
    dtsPaths.set(".", packageJson["types"]);
  }

  if (packageJson["typings"]) {
    dtsPaths.set(".", packageJson["typings"]);
  }

  if (packageJson["exports"]) {
    for (const [name, entry] of Object.entries(packageJson["exports"])) {
      const types = entry.types || entry.import?.types || entry.require?.types;
      if (types) {
        dtsPaths.set(name, types);
      }
    }
  }

  if (packageJson["typesVersions"]) {
    let config = packageJson["typesVersions"]["*"];

    if (!config) {
      const highestVersion = Object.keys(packageJson["typesVersions"])
        .sort(compareVersions)
        .at(-1);
      config = packageJson["typesVersions"][highestVersion];
    }

    for (let [name, entry] of Object.entries(config)) {
      if (name !== "." && !name.startsWith("./")) {
        name = `./${name}`;
      }

      let path = entry[0];
      if (!path.endsWith(".d.ts")) {
        path = `${path}.d.ts`;
      }

      dtsPaths.set(name, path);
    }
  }

  return dtsPaths;
}

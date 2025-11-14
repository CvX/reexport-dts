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
      const types = entry.types || entry.import?.types || entry.require?.types;
      if (types) {
        dtsPaths.set(name, types);
      }
    }
  }

  return dtsPaths;
}

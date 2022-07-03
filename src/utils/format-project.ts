import fs from "fs/promises";
import path from "path";
import fetch from "node-fetch";
import { customAlphabet } from "nanoid/async";
import { lowercase, numbers } from "nanoid-dictionary";

import { toJson } from "./to-json";

const nanoid = customAlphabet(lowercase + numbers, 5);

async function createAppName(): Promise<string> {
  const name = `nbundle-app-${await nanoid()}`;
  const res = await fetch(`https://developers.nbundle.com/api/v1/apps/${name}`);
  if (res.status === 404) return name;
  if (res.ok) return createAppName();
  throw new Error("Couldn't generate app name.");
}

export async function formatProject(projectDirectory: string): Promise<void> {
  await Promise.all(
    [
      ".github",
      ".vscode",
      ".husky",
      "commitlint.config.js",
      "cspell.json",
      "LICENSE",
      "lint-staged.config.js",
      ".prettierignore",
      "yarn.lock",
    ].map((file) =>
      fs.rm(path.join(projectDirectory, file), { recursive: true })
    )
  );
  const name = path.basename(projectDirectory);
  const pkgJsonPath = path.join(projectDirectory, "package.json");
  const pkg = JSON.parse(await fs.readFile(pkgJsonPath, "utf8"));
  pkg.name = await createAppName();
  pkg.productName = name;
  pkg.devDependencies = Object.fromEntries(
    Object.entries(pkg.devDependencies).filter(([key]) =>
      key.startsWith("@nbundle/")
    )
  );
  if (pkg.scripts.prepare) delete pkg.scripts.prepare;
  await fs.writeFile(
    pkgJsonPath,
    toJson({
      name: pkg.name,
      version: pkg.version,
      productName: pkg.productName,
      description: pkg.description,
      ...pkg,
    }),
    "utf8"
  );
}

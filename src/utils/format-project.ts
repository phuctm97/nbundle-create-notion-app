import fs from "fs/promises";
import path from "path";
import fetch from "node-fetch";
import { customAlphabet } from "nanoid/async";
import { lowercase, numbers } from "nanoid-dictionary";
import { capitalCase } from "capital-case";

import { toJson } from "./to-json";

const nanoid = customAlphabet(lowercase + numbers, 5);

async function createAppName(): Promise<string> {
  const name = `nbundle-app-${await nanoid()}`;
  const res = await fetch(`https://developers.nbundle.com/api/v1/apps/${name}`);
  if (res.status === 404) return name;
  if (res.ok) return createAppName();
  throw new Error("Couldn't generate app name.");
}

export interface FormatProjectOptions {
  keepDefaultDevtools?: boolean;
}

export async function formatProject(
  projectDirectory: string,
  options?: FormatProjectOptions
): Promise<void> {
  await Promise.all(
    [
      "LICENSE",
      "yarn.lock",
      ...(options?.keepDefaultDevtools
        ? []
        : [
            ".github",
            ".vscode",
            ".husky",
            "commitlint.config.js",
            "cspell.json",
            "lint-staged.config.js",
            ".prettierignore",
          ]),
    ].map((file) =>
      fs.rm(path.join(projectDirectory, file), { recursive: true })
    )
  );

  if (options?.keepDefaultDevtools) {
    const cspellJsonPath = path.join(projectDirectory, "cspell.json");
    const cspell = JSON.parse(await fs.readFile(cspellJsonPath, "utf8"));
    cspell.words = cspell.words.filter(
      (w: string) => !["minh", "phuc"].includes(w)
    );
    await fs.writeFile(cspellJsonPath, toJson(cspell), "utf8");
  }

  const name = path.basename(projectDirectory);
  const pkgJsonPath = path.join(projectDirectory, "package.json");
  const pkg = JSON.parse(await fs.readFile(pkgJsonPath, "utf8"));
  pkg.name = await createAppName();
  pkg.productName = capitalCase(name);
  if (pkg.scripts.prepare) delete pkg.scripts.prepare;
  if (!options?.keepDefaultDevtools) {
    pkg.devDependencies = Object.fromEntries(
      Object.entries(pkg.devDependencies).filter(([key]) =>
        key.startsWith("@nbundle/")
      )
    );
  }
  await fs.writeFile(pkgJsonPath, toJson(pkg), "utf8");
}

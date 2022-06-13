import fs from "fs/promises";
import path from "path";

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
  pkg.name = name;
  pkg.productName = name;
  pkg.devDependencies = Object.fromEntries(
    Object.entries(pkg.devDependencies).filter(([key]) =>
      key.startsWith("@nbundle/")
    )
  );
  if (pkg.scripts.prepare) delete pkg.scripts.prepare;
  await fs.writeFile(pkgJsonPath, JSON.stringify(pkg, null, 2), "utf8");
}

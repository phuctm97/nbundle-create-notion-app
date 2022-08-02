import fs from "fs/promises";
import chalk from "chalk";

import {
  mustBeEmpty,
  downloadAndExtractRepo,
  formatProject,
  installDependencies,
  tryGitInit,
  toJson,
} from "./utils";
import path from "path";

export interface CreateOptions {
  typescript?: boolean;
  devtool?: boolean;
}

export default async function create(
  projectDirectory: string,
  options: CreateOptions
): Promise<void> {
  await fs.mkdir(projectDirectory, { recursive: true });

  await mustBeEmpty(projectDirectory);

  const example = `example${options.typescript ? "-ts" : ""}`;

  console.log(
    `\nDownloading template ${chalk.cyan(example)}. This might take a moment.\n`
  );

  await downloadAndExtractRepo(projectDirectory, {
    username: "nbundle",
    name: example,
    branch: "main",
  });

  await formatProject(projectDirectory, options);

  if ((await tryGitInit(projectDirectory)) && options.devtool) {
    const pkgJsonPath = path.join(projectDirectory, "package.json");
    const pkg = JSON.parse(await fs.readFile(pkgJsonPath, "utf8"));
    if (pkg.devDependencies.husky) {
      pkg.scripts.prepare = "husky install";
      await fs.writeFile(pkgJsonPath, toJson(pkg), "utf8");
    }
  }

  console.log("Installing packages. This might take up to a few minutes.");

  await installDependencies(projectDirectory);

  console.log();

  const packageManager = "yarn";
  const useYarn = packageManager === "yarn";

  const name = path.basename(projectDirectory);
  let cdPath: string;
  if (path.join(process.cwd(), name) === projectDirectory) {
    cdPath = name;
  } else {
    cdPath = projectDirectory;
  }
  console.log(
    `${chalk.green("Success!")} Created ${chalk.blue(projectDirectory)}\n`
  );
  console.log("Inside that directory, you can run several commands:\n");
  console.log(
    chalk.cyan(`  ${packageManager} ${useYarn ? "" : "run "}develop`)
  );
  console.log("    Starts the development server.\n");
  console.log(chalk.cyan(`  ${packageManager} ${useYarn ? "" : "run "}build`));
  console.log("    Builds the app for production.\n");
  console.log(chalk.cyan(`  ${packageManager} preview`));
  console.log("    Runs the built app in production mode.\n");
  console.log("We suggest that you begin by typing:\n");
  console.log(chalk.cyan("  cd"), cdPath);
  console.log(
    `  ${chalk.cyan(`${packageManager} ${useYarn ? "" : "run "}develop`)}\n`
  );
}

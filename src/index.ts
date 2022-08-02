import path from "path";
import fs from "fs/promises";
import chalk from "chalk";
import updateCheck from "update-check";
import prompts from "prompts";
import { Command, Option } from "commander";

import requireInviteCode from "./require-invite-code";
import create from "./create";

async function getPkg() {
  const pkgJson = await fs.readFile(
    path.resolve(__dirname, "..", "package.json"),
    "utf8"
  );
  return JSON.parse(pkgJson);
}

async function checkForUpdates(): Promise<void> {
  const pkg = await getPkg();
  if (pkg.version === "0.0.0-SNAPSHOT") return;
  const res = await updateCheck(pkg);
  if (res?.latest) {
    console.log(
      `\n${chalk.yellow.bold(
        `A new version of ${chalk.green.bold(
          pkg.name
        )} is available and required!`
      )}\n\nRun ${chalk.cyan(
        `yarn global add ${pkg.name}`
      )} to update then try again.\n`
    );
    process.exit(1);
  }
}

async function run() {
  await requireInviteCode();

  const program = new Command();
  const pkg = await getPkg();
  program
    .name(pkg.name)
    .description(pkg.description)
    .version(pkg.version, "-v, -V, --version")
    .arguments("[<project-directory>]")
    .usage(`[<project-directory>] [options]`)
    .option("-t, --ts, --typescript", "initialize as a TypeScript project")
    .addOption(
      new Option(
        "-t, --typescript",
        "initialize as a TypeScript project"
      ).hideHelp()
    )
    .option(
      "--devtool",
      "use default devtools (prettier, husky, lint-staged, commitlint, & cspell)"
    )
    .action(async (optionalProjectDirectory, opts) => {
      let projectDirectory = optionalProjectDirectory;
      if (!projectDirectory) {
        const { projectName } = await prompts({
          name: "projectName",
          type: "text",
          message: "What is your project name?",
        });
        if (!projectName) {
          console.error(chalk.red("Project name is required."));
          process.exit(1);
        }
        projectDirectory = projectName;
      }
      await create(path.resolve(projectDirectory), {
        typescript: opts.ts || opts.typescript,
        devtool: opts.devtool,
      });
    });
  await program.parseAsync();
}

checkForUpdates()
  .then(run)
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

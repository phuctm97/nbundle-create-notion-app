import path from "path";
import fs from "fs/promises";
import { Command, Option } from "commander";

import create from "./create";

async function index() {
  const program = new Command();

  const pkgJson = await fs.readFile(
    path.resolve(__dirname, "..", "package.json"),
    "utf8"
  );
  const pkg = JSON.parse(pkgJson);

  program
    .name(pkg.name)
    .description(pkg.description)
    .version(pkg.version, "-v, -V, --version")
    .arguments("<project-directory>")
    .usage(`<project-directory> [options]`)
    .option("-t, --ts, --typescript", "initialize as a TypeScript project")
    .addOption(
      new Option(
        "-t, --typescript",
        "initialize as a TypeScript project"
      ).hideHelp()
    )
    .action((projectDirectory, opts) =>
      create(path.resolve(projectDirectory), {
        typescript: opts.ts || opts.typescript,
      })
    );

  await program.parseAsync();
}

index().catch((err) => {
  console.error(err);
  process.exit(1);
});

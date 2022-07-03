import path from "path";
import fs from "fs/promises";
import chalk from "chalk";

export async function mustBeEmpty(directory: string): Promise<void> {
  const validFiles = [
    ".DS_Store",
    ".git",
    ".gitattributes",
    ".gitignore",
    ".gitlab-ci.yml",
    ".hg",
    ".hgcheck",
    ".hgignore",
    ".idea",
    ".npmignore",
    ".travis.yml",
    "LICENSE",
    "Thumbs.db",
    "docs",
    "mkdocs.yml",
    "npm-debug.log",
    "yarn-debug.log",
    "yarn-error.log",
  ];

  const files = await fs.readdir(directory);
  const conflicts = files
    .filter((file) => !validFiles.includes(file))
    // Support IntelliJ IDEA-based editors
    .filter((file) => !/\.iml$/.test(file));
  if (conflicts.length === 0) return;

  console.error(
    `\nThe directory ${chalk.green(
      directory
    )} contains files that might conflict:\n`
  );
  for (const file of conflicts) {
    try {
      const stats = await fs.lstat(path.join(directory, file));
      if (stats.isDirectory()) {
        console.error(`  ${chalk.blue(file)}/`);
      } else {
        console.error(`  ${file}`);
      }
    } catch {
      console.error(`  ${file}`);
    }
  }
  console.error(
    "\nEither try using another directory or remove the files listed above.\n"
  );
  process.exit(1);
}

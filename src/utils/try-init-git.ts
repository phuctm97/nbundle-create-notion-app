import { exec } from "./async-exec";

async function isInGitRepository(projectDirectory: string): Promise<boolean> {
  try {
    await exec("git rev-parse --is-inside-work-tree", {
      cwd: projectDirectory,
    });
    return true;
  } catch {
    return false;
  }
}

async function isInMercurialRepository(
  projectDirectory: string
): Promise<boolean> {
  try {
    await exec("hg --cwd . root", {
      cwd: projectDirectory,
    });
    return true;
  } catch {
    return false;
  }
}

export async function tryGitInit(projectDirectory: string): Promise<boolean> {
  try {
    await exec("git --version", {
      cwd: projectDirectory,
    });
    if (
      (await isInGitRepository(projectDirectory)) ||
      (await isInMercurialRepository(projectDirectory))
    ) {
      return false;
    }
    await exec("git init", {
      cwd: projectDirectory,
    });
    return true;
  } catch {
    return false;
  }
}

import { exec } from "./async-exec";

export async function installDependencies(
  projectDirectory: string
): Promise<void> {
  await exec(`yarn install`, { cwd: projectDirectory });
}

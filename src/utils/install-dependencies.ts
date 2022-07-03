import ms from "ms";

import { exec } from "./async-exec";

export async function installDependencies(
  projectDirectory: string
): Promise<void> {
  const internal = setInterval(() => {
    console.log("Hang on, packages are still being installed…");
  }, ms("5s"));
  await exec(`yarn install`, { cwd: projectDirectory });
  clearInterval(internal);
}

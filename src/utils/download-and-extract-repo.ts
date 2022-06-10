import got from "got";
import tar from "tar";
import retry from "async-retry";

import { pipeline } from "./async-pipeline";

export interface Repo {
  username: string;
  name: string;
  branch: string;
  filePath?: string;
}

export async function downloadAndExtractRepo(
  destinationDirectory: string,
  { username, name, branch, filePath }: Repo
): Promise<void> {
  return retry(
    () =>
      pipeline(
        got.stream(
          `https://codeload.github.com/${username}/${name}/tar.gz/${branch}`
        ),
        tar.extract(
          {
            cwd: destinationDirectory,
            strip: filePath ? filePath.split("/").length + 1 : 1,
          },
          [
            `${name}-${branch.replace(/\//g, "-")}${
              filePath ? `/${filePath}` : ""
            }`,
          ]
        )
      ),
    {
      retries: 3,
    }
  );
}

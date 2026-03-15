import fs from "fs";
import path from "path";
import unzipper from "unzipper";

export async function extractZip(zipPath: string) {
  const extractDir = path.join("uploads/imports", `extracted-${Date.now()}`);

  await fs
    .createReadStream(zipPath)
    .pipe(unzipper.Extract({ path: extractDir }))
    .promise();
  return extractDir;
}

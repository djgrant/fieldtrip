import nock from "nock";
import { join as pathJoin } from "path";
import { readFile, readdir } from "fs/promises";
import { Dirent } from "fs";

/**
 * @description Generates nocks to Github Contents API for every file and directory within @param absPathToDir
 */
export async function generateGhContentsApiNocks(
  absPathToDir: string,
  repo: string,
  owner: string
) {
  const getDirents = (relativeRootPath: string) => {
    const absPath = pathJoin(absPathToDir, relativeRootPath);
    return readdir(absPath, { withFileTypes: true });
  };
  async function generateNocks(relativeRootPath: string = ".") {
    const dirents = await getDirents(relativeRootPath);
    generateDirNock("", dirents, repo, owner);
    dirents.forEach(async (dirent) => {
      const direntPath = pathJoin(relativeRootPath, dirent.name);

      if (dirent.isDirectory()) {
        const childDirents = await getDirents(direntPath);
        generateDirNock(direntPath, childDirents, repo, owner);
        generateNocks(direntPath);
      } else {
        const contents = await readFile(pathJoin(absPathToDir, direntPath));
        generateFileNock(direntPath, dirent.name, contents, repo, owner);
      }
    });
  }
  generateNocks();
}

function generateFileNock(
  path: string,
  filename: string,
  contents: Buffer,
  repo: string,
  owner: string
) {
  nock("https://api.github.com")
    .get(`/repos/${owner}/${repo}/contents/${path}?name=course`)
    .reply(200, getFileResponse(path, filename, contents, repo, owner));
}

function generateDirNock(
  path: string,
  dirents: Dirent[],
  repo: string,
  owner: string
) {
  console.log(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    "pop"
  );
  nock("https://api.github.com")
    .get(`/repos/${owner}/${repo}/contents/${path}?name=course`)
    .reply(200, getDirResponse(path, dirents, repo, owner));
}

function getFileResponse(
  filePath: string,
  filename: string,
  content: Buffer,
  repo: string,
  owner: string
) {
  return {
    type: "file",
    name: filename,
    path: filePath,
    url: `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    content: Buffer.from(content).toString("base64"),
    encoding: "base64",
  };
}

function getDirResponse(
  dirPath: string,
  dirents: Dirent[],
  repo: string,
  owner: string
) {
  return dirents.map((dirent) => ({
    type: dirent.isDirectory() ? "dir" : "file",
    name: dirent.name,
    path: pathJoin(dirPath, dirent.name),
    url: `https://api.github.com/repos/${owner}/${repo}/contents/${pathJoin(
      dirPath,
      dirent.name
    )}`,
  }));
}

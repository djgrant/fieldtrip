import { Octokit } from "@octokit/rest";
import { Github_AUTH } from "src/config";

type CourseMeta = {
  owner: string;
  repo: string;
  path: string;
  name: string;
};

type Files = {
  [key: string]: any;
};

const defaultTsConfig = {
  include: ["**/*"],
  compilerOptions: {
    rootDir: ".",
    baseUrl: ".",
    module: "EsNext",
    moduleResolution: "Node",
    strict: false,
    noImplicitAny: false,
    allowSyntheticDefaultImports: true,
    outDir: null,
    declarationDir: null,
    declaration: false,
    importsNotUsedAsValues: "remove",
    noEmit: true,
    isolatedModules: true,
  },
};

const defaultFiles = {
  "tsconfig.json": JSON.stringify(defaultTsConfig, null, 4),
};

const fetchCourse = async (
  options: CourseMeta,
  files: Files = defaultFiles
) => {
  const octokit = new Octokit({
    auth: Github_AUTH,
  });
  const { data } = await octokit.repos.getContent(options);
  if (Array.isArray(data)) {
    await Promise.all(
      data.map(async (item) => {
        if (item.type === "dir") {
          await fetchCourse({ ...options, path: item.path }, files);
        }
        if (item.type === "file") {
          const { data } = await octokit.rest.repos.getContent({
            ...options,
            path: item.path,
          });
          const { path, content: fileContent } = data;
          console.log(path, "path");
          const content = Buffer.from(fileContent, "base64").toString("utf8");
          files[path] = content;
          /*           if (!existsSync(`course/${dirname(path)}`)) {
            mkdir(`course/${dirname(path)}`, { recursive: true }, (err) => {
              console.log(err);
              return;
            });
          } */
          /* const target = `${process.cwd()}/${options.name}/${path}`;
          writeFile(target, content, "base64", () => {}); */
          // writeFileSync(target, content, "base64");
        }
      })
    );
  }
  return files;
};

export default fetchCourse;

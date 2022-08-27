import { existsSync, mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { Octokit } from "@octokit/rest";
import { GITHUB_AUTH } from "src/config";

const courses = ["https://github.com/alaa-yahia/course"];

type CourseMeta = {
  owner: string;
  repo: string;
  path: string;
  name: string;
};

type Files = {
  [key: string]: any;
};

//Extract meta from urls
const coursesMeta = (courses: string[]) => {
  //name = repo | repo.directory
  //path = "" | repo.directory
  return [{ owner: "alaa-yahia", repo: "course", path: "", name: "course" }];
};

coursesMeta(courses).forEach((course: CourseMeta) => {
  mkdirSync(join("../../", process.cwd(), course.name), { recursive: true });
});

const fetchCourse = async (options: CourseMeta, courseFiles: Files = {}) => {
  const octokit = new Octokit({
    auth: GITHUB_AUTH,
  });

  const { data } = await octokit.repos.getContent(options);
  if (Array.isArray(data)) {
    await Promise.all(
      data.map(async (item) => {
        if (item.type === "dir") {
          await fetchCourse({ ...options, path: item.path }, courseFiles);
        }

        if (item.type === "file") {
          const { data } = await octokit.rest.repos.getContent({
            ...options,
            path: item.path,
          });

          const { path, content: fileContent } = data;
          const content = Buffer.from(fileContent, "base64").toString("utf8");
          courseFiles[path] = content;
          if (!existsSync(join("../../", options.name, dirname(path)))) {
            mkdirSync(`../../course/${dirname(path)}`, { recursive: true });
          }
          const target = `../../${options.name}/${path}`;
          writeFileSync(target, content, {
            encoding: "utf8",
            flag: "w",
          });
        }
      })
    );
  }

  return { course: options.name };
};

export default fetchCourse;

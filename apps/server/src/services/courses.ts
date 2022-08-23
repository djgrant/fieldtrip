import { Octokit } from "@octokit/rest";
import { mkdirSync } from "fs";
import { Github_AUTH } from "src/config";

const courses = ["https://github.com/alaa-yahia/course"];

type courseMeta = {
  owner: string;
  repo: string;
  path: string;
  name: string;
};
type files = {
  [key: string]: any;
};

//Extract meta from urls
const coursesMeta = (courses: [string]) => {
  //name = repo | repo.directory
  //path = "" | repo.directory
  return [{ owner: "alaa-yahia", repo: "course", path: "", name: "course" }];
};

/* coursesMeta(courses).forEach((course: courseMeta) => {
  mkdirSync(course.name, { recursive: true });
}); */

const fetchCourse = async (options: courseMeta, files: files = {}) => {
  try {
    const octokit = new Octokit({
      auth: Github_AUTH,
    });

    const { data } = await octokit.repos.getContent(options);
    if (data) {
      for (const item of data) {
        if (item.type === "dir") {
          await fetchCourse({ ...options, path: item.path }, files);
        }
        if (item.type === "file") {
          const {
            data: { path, content: fileContent },
          } = await octokit.rest.repos.getContent({
            ...options,
            path: item.path,
          });
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
      }
    }
    // console.log(files, "files");
    return files;
  } catch (err) {
    console.log(err);
    return;
  }
};

export default fetchCourse;

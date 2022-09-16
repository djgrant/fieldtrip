import { existsSync, mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { execSync } from "child_process";
import { Octokit } from "@octokit/rest";
import { GITHUB_AUTH } from "src/config";
import schema from "../utils/courseSchema";

type CourseMeta = {
  owner: string;
  repo: string;
  path: string;
  name: string;
};

type Files = {
  [key: string]: any;
};

export const courses = new Map();

const registeredCourses = ["https://github.com/alaa-yahia/course"];

//Extract meta from urls
const meta = (registeredCourses: string[]): CourseMeta[] => {
  //name = repo | repo.directory
  //path = "" | repo.directory
  //regex
  return [{ owner: "alaa-yahia", repo: "course", path: "", name: "course" }];
};

const coursesMeta = meta(registeredCourses);

coursesMeta.forEach((courseMeta) => {
  mkdirSync(join("../../", process.cwd(), "courses", courseMeta.name), {
    recursive: true,
  });
});

const getCourse = async (meta: CourseMeta, courseFiles: Files = {}) => {
  const octokit = new Octokit({
    auth: GITHUB_AUTH,
  });

  const { data } = await octokit.repos.getContent(meta);
  if (Array.isArray(data)) {
    await Promise.all(
      data.map(async (item) => {
        if (item.type === "dir") {
          await getCourse({ ...meta, path: item.path }, courseFiles);
        }

        if (item.type === "file") {
          const { data } = await octokit.rest.repos.getContent({
            ...meta,
            path: item.path,
          });

          const { path, content: fileContent } = data;
          const content = Buffer.from(fileContent, "base64").toString("utf8");
          courseFiles[path] = content;
          if (!existsSync(join("../../courses", meta.name, dirname(path)))) {
            mkdirSync(`../../courses/${meta.name}/${dirname(path)}`, {
              recursive: true,
            });
          }
          const target = `../../courses/${meta.name}/${path}`;
          writeFileSync(target, content, {
            encoding: "utf8",
            flag: "w",
          });
        }
      })
    );
  }

  return { course: meta.name };
};

const compileCourse = async (courseName: string) => {
  const rollupConfigTarget = `../../courses/${courseName}/rollup.config.js`;
  const rollupConfigContent = `
    import esbuild from 'rollup-plugin-esbuild'
    export default {
      input: "config.ts",
      plugins: [
        esbuild(),
      ],
      output: {
        file: "${courseName}.js",
        format: "cjs",
      },
    };`;

  writeFileSync(rollupConfigTarget, rollupConfigContent);

  execSync(`npm install`, {
    cwd: `../../courses/${courseName}`,
  });
  execSync(`rollup --config rollup.config.js`, {
    cwd: `../../courses/${courseName}`,
  });

  if (existsSync(`../../courses/${courseName}/course.js`)) {
    const loadedFile = require(join(
      process.cwd(),
      `../../courses/${courseName}/course.js`
    ));
    if (!loadedFile) {
      return { [courseName]: "Not Valid" };
    }

    console.log("Course compiled successfuly");

    const valid = await schema.isValid(loadedFile);
    if (!valid) {
      return { [courseName]: "Not Valid" };
    }
    courses.set(courseName, loadedFile);
    return { [courseName]: loadedFile };
  }
};

export const fetchCourse = async (course: CourseMeta) => {
  const { course: courseName } = await getCourse(course);
  console.log(`${courseName} written to disk`);
  return await compileCourse(courseName);
};

export const fetchCourses = async () => {
  return await Promise.all(
    coursesMeta.map(async (course) => {
      return await fetchCourse(course);
    })
  );
};

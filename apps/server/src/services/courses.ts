import { existsSync, mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { execSync } from "child_process";
import { Octokit } from "@octokit/rest";
import { GITHUB_AUTH } from "src/config";
import schema from "../utils/courseSchema";
import type { CourseConfig } from "@notation/fieldtrip";

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
export const extractCourseMeta = (registeredCourse: string): CourseMeta => {
  //name = repo | repo.directory
  //path = "" | repo.directory
  //regex
  return { owner: "alaa-yahia", repo: "course", path: "", name: "course" };
};

const coursesMeta = registeredCourses.map(extractCourseMeta);

coursesMeta.forEach((course) => {
  mkdirSync(join("../../", process.cwd(), "courses", course.name), {
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

const compileCourse = (courseName: string) => {
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
};

const loadCompiledCourse = (path: string) => {
  if (existsSync(path)) {
    const loadedFile = require(join(process.cwd(), path));
    if (!loadedFile) {
      return null;
    }
    return loadedFile;
  }
  return null;
};

const isCourseValid = async (course: CourseConfig) => {
  if (!course) {
    return false;
  }
  const isSchemaValid = await schema.isValid(course);
  if (!isSchemaValid) {
    return false;
  }
  return true;
};

//need better name
export const fetchCourse = async (course: CourseMeta) => {
  const coursePath = join("../../", "courses", course.name);

  if (
    !(
      existsSync(coursePath) &&
      existsSync(join(coursePath, `${course.name}.js`))
    )
  ) {
    const { course: courseName } = await getCourse(course);
    console.log(`${courseName} written to disk`);
    compileCourse(courseName);
    console.log("Course compiled successfuly");
  }

  const configFile = loadCompiledCourse(join(coursePath, `${course.name}.js`));

  const isValid = await isCourseValid(configFile);
  if (isValid) {
    courses.set(course.name, configFile);
  }
  return isValid;
};

export const fetchCourses = async () => {
  return await Promise.all(
    coursesMeta.map(async (course) => {
      return await fetchCourse(course);
    })
  );
};

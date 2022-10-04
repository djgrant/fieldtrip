import { existsSync, mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { execSync } from "child_process";
import { Octokit } from "@octokit/rest";
import { GITHUB_AUTH } from "src/config";
import schema from "../utils/courseSchema";
import { db, courses as registeredCourses } from "src/services/db";
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

const loadRegisteredCourses = async () => {
  const courses = (await registeredCourses(db).find().all()) || [];
  return courses.map((course) => course.course_url);
};

//Extract meta from urls
export const extractCourseMeta = (registeredCourse: string): any => {
  const url = new URL(registeredCourse, "https://github.com/").pathname
    .split("/")
    .slice(1);

  return {
    owner: url[0],
    repo: url[1],
    path: url[2] || "",
    name: url[2] || url[1],
  };
};

const getCourse = async (meta: CourseMeta, courseFiles: Files = {}) => {
  const octokit = new Octokit({
    auth: GITHUB_AUTH,
  });
  try {
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

            // @todo add typeguard to refine type for data
            // https://www.typescriptlang.org/docs/handbook/2/narrowing.html
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
  } catch (err) {
    //console.log(err);
    return null;
  }
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
  return await schema.isValid(course);
};

export const loadCourse = async (course: CourseMeta) => {
  const coursePath = join("../../", "courses", course.name);

  if (
    !(
      existsSync(coursePath) &&
      existsSync(join(coursePath, `${course.name}.js`))
    )
  ) {
    const courseFiles = await getCourse(course);
    if (!courseFiles) {
      return false;
    }
    const { course: courseName } = courseFiles;
    console.log(`${courseName} written to disk`);
    compileCourse(courseName);
    console.log("Course compiled successfuly");
  }

  const configFile = loadCompiledCourse(join(coursePath, `${course.name}.js`));

  const isValid = await isCourseValid(configFile);
  if (isValid) {
    courses.set(configFile.id, configFile);
  }
  return isValid;
};

export const loadCourses = async () => {
  const registeredCourses = await loadRegisteredCourses();
  const coursesMeta = registeredCourses.map(extractCourseMeta);

  coursesMeta.forEach((course) => {
    mkdirSync(join("../../", process.cwd(), "courses", course.name), {
      recursive: true,
    });
  });

  return await Promise.all(
    coursesMeta.map(async (course) => {
      return await loadCourse(course);
    })
  );
};

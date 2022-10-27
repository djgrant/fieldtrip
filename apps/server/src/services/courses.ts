import { existsSync, mkdirSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";
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

const coursesDirPath = resolve(__dirname, "../../../../", "courses");

export const courses = new Map();

export const loadRegisteredCourses = async () => {
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

export const getCourse = async (meta: CourseMeta, courseFiles: Files = {}) => {
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
            const { data } = await octokit.repos.getContent({
              ...meta,
              path: item.path,
            });

            // @todo add typeguard to refine type for data
            // https://www.typescriptlang.org/docs/handbook/2/narrowing.html
            const { path, content: fileContent } = data as any;
            const content = Buffer.from(fileContent, "base64").toString("utf8");
            courseFiles[path] = content;

            if (!existsSync(join(coursesDirPath, meta.name, dirname(path)))) {
              mkdirSync(join(coursesDirPath, meta.name, dirname(path)), {
                recursive: true,
              });
            }
            const target = join(coursesDirPath, meta.name, path);
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
    console.log(err);
    return null;
  }
};

const compileCourse = (courseName: string) => {
  console.log("compiled v compiled ");
  const rollupConfigTarget = resolve(
    __dirname,
    "../../../../",
    "courses",
    courseName,
    "rollup.config.js"
  );
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
    cwd: join(coursesDirPath, courseName),
  });
  execSync(`rollup --config rollup.config.js`, {
    cwd: join(coursesDirPath, courseName),
  });
};

export const loadCompiledCourse = (path: string) => {
  if (existsSync(path)) {
    const loadedFile = require(path);
    if (!loadedFile) {
      return null;
    }
    return loadedFile;
  }
  return null;
};

export const isCourseValid = async (course: CourseConfig) => {
  if (!course) {
    return false;
  }
  return await schema.isValid(course);
};

export const loadCourse = async (course: CourseMeta) => {
  const coursePath = join(coursesDirPath, course.name);

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
  //const registeredCourses = ["https://github.com/alaa-yahia/course"];
  const coursesMeta = registeredCourses.map(extractCourseMeta);

  coursesMeta.forEach((course) => {
    mkdirSync(join(coursesDirPath, course.name), {
      recursive: true,
    });
  });

  return await Promise.all(
    coursesMeta.map(async (course) => {
      return await loadCourse(course);
    })
  );
};

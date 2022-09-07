import { existsSync, mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { Octokit } from "@octokit/rest";
import { GITHUB_AUTH } from "src/config";
import schema from "../utils/courseSchema";
import { exec } from "child_process";

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
const meta = (registeredCourses: string[]) => {
  //name = repo | repo.directory
  //path = "" | repo.directory
  //regex
  return [{ owner: "alaa-yahia", repo: "course", path: "", name: "course" }];
};

const coursesMeta = meta(registeredCourses);

coursesMeta.forEach((courseMeta: CourseMeta) => {
  mkdirSync(join("../../", process.cwd(), "courses", courseMeta.name), {
    recursive: true,
  });
});

const fetchCourse = async (meta: CourseMeta, courseFiles: Files = {}) => {
  const octokit = new Octokit({
    auth: GITHUB_AUTH,
  });
  console.log("Fetching course has started");
  const { data } = await octokit.repos.getContent(meta);
  if (Array.isArray(data)) {
    await Promise.all(
      data.map(async (item) => {
        if (item.type === "dir") {
          await fetchCourse({ ...meta, path: item.path }, courseFiles);
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

const fetchCourses = async () => {
  coursesMeta.forEach(async (course) => {
    const { course: courseName } = await fetchCourse(course);
    console.log(`${courseName} written to disk`);
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

    const tsConfigTarget = `../../courses/${courseName}/tsconfig.json`;
    const tsConfigContent = `
    {
      "compilerOptions": {
        "baseUrl": "./",
        "target": "ES2020",
        "module": "CommonJS",
        "moduleResolution": "Node",
        "strict": true,
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true
      },
      "include": ["./"]
    }`;

    writeFileSync(rollupConfigTarget, rollupConfigContent, {
      encoding: "utf8",
      flag: "w",
    });
    writeFileSync(tsConfigTarget, tsConfigContent, {
      encoding: "utf8",
      flag: "w",
    });
    exec(
      `npm install`,
      {
        cwd: `../../courses/${courseName}`,
      },
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
    exec(
      `rollup --config rollup.config.js`,
      {
        cwd: `../../courses/${courseName}`,
      },
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Course compiled successfuly");
          const loadedFile = require(join(
            process.cwd(),
            "../../courses/course/course.js"
          ));
          console.log(loadedFile, "lop");
          if (loadedFile) {
            schema.isValid(loadedFile).then((valid) => {
              console.log(valid, "valid");
              courses.set(courseName, course);
            });
          }
        }
      }
    );
  });
};

export default fetchCourses;

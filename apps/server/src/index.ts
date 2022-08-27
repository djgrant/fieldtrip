import { mkdirSync, writeFileSync } from "fs";
import { exec } from "child_process";
import { app } from "./app";
import * as config from "./config";
import { io } from "./io";
import { migrate, taskq } from "./services";
import { processTrigger } from "./tasks";
import fetchCourse from "./services/courses";

fetchCourse({
  owner: "alaa-yahia",
  repo: "course",
  path: "",
  name: "course",
}).then(({ course }) => {
  console.log("Files written to disk");
  mkdirSync(`../../course/`, { recursive: true });

  const target = `../../course/rollup.config.js`;
  const content = `
  import typescript from "@rollup/plugin-typescript";
  export default {
    input: "config.ts",
    plugins: [
      typescript(),
    ],
    output: {
      file: "${course}.js",
      format: "cjs",
    },
  };`;

  writeFileSync(target, content, {
    encoding: "utf8",
    flag: "w",
  });

  exec(
    `rollup --config rollup.config.js`,
    {
      cwd: "../../course",
    },
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Course compiled successfuly");
      }
    }
  );
});
migrate()
  .then(() => {
    const server = app.listen(config.PORT, () => {
      console.log("app listening on port", config.PORT);
    });

    io(server);

    taskq.take(/^trigger:/, processTrigger);
    taskq.start();
  })
  .catch((err) => {
    throw err;
  });

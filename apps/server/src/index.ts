import { app } from "./app";
import * as config from "./config";
import { io } from "./io";
import { migrate, taskq } from "./services";
import fetchCourse from "./services/courses";
import { build } from "./services/esbuild";
import { processTrigger } from "./tasks";

fetchCourse({
  owner: "alaa-yahia",
  repo: "course",
  path: "",
  name: "course",
}).then((files) => {
  build({ files, entry: "./config.ts" });
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

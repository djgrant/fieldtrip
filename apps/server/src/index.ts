import runServer from "./app";
import * as config from "./config";
import { io } from "./io";
import { migrate, taskq } from "./services";
import { processTrigger } from "./tasks";
import { loadCourses } from "./services/courses";

migrate()
  .then(async () => {
    /*     const courses = await loadCourses();
    console.log(courses); */

    const server = runServer().listen(config.PORT, () => {
      console.log("app listening on port", config.PORT);
    });

    io(server);

    taskq.take(/^trigger:/, processTrigger);
    taskq.start();
  })
  .catch((err) => {
    throw err;
  });

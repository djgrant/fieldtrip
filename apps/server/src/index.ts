import createServer from "./app";
import * as config from "./config";
import { io } from "./io";
import { migrate, taskq } from "./services";
import { processTrigger } from "./tasks";
import { loadCourses } from "./services/courses";

export const prepareServer = async () => {
  await migrate();
  await loadCourses();
  return;
};

prepareServer().then(() => {
  const server = createServer().listen(config.PORT, () => {
    console.log("app listening on port", config.PORT);
  });

  io(server);

  taskq.take(/^trigger:/, processTrigger);
  taskq.start();
});

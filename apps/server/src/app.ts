import express from "express";
import * as routers from "./routers";
import * as mw from "./middlewares";
import * as bots from "src/services/bots";

const runServer = () => {
  const app = express();
  app.use(mw.cors);
  app.use(mw.locals);
  app.use(mw.session);
  app.use([
    mw.bots(bots).fieldtrip,
    mw.bots(bots).malachi,
    mw.bots(bots).uma,
    mw.bots(bots).amber,
  ]);
  app.use(["/api/user", "/api/courses/:id"], mw.userSession);
  app.use("/api/courses/:id", [mw.course, mw.db, mw.botSessions]);
  app.use("/api", routers.api);
  app.use("/auth", routers.auth);
  return app;
};

export default runServer;

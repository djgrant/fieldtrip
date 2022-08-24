import type { Server as HTTPServer } from "http";
import { Course, Enrollments } from "@notation/fieldtrip";
import { Server } from "socket.io";
import { emitter } from "./emitter";
import * as mw from "./middlewares";
import * as config from "./config";
import courses from "@packages/courses";
import fetchCourse from "./services/courses";
import { rollup } from "rollup";
import swc from "rollup-plugin-swc";
import virtual from "@rollup/plugin-virtual";

const defaultTsConfig = {
  include: ["**/*"],
  compilerOptions: {
    rootDir: ".",
    baseUrl: ".",
    module: "EsNext",
    moduleResolution: "Node",
    strict: false,
    noImplicitAny: false,
    allowSyntheticDefaultImports: true,
    outDir: null,
    declarationDir: null,
    declaration: false,
  },
};

export const io = (server: HTTPServer) => {
  console.log(process.cwd(), "process.cwd()");
  fetchCourse({
    owner: "alaa-yahia",
    repo: "course",
    path: "",
    name: "course",
  }).then(build);

  const io = new Server(server, {
    path: "/ws",
    cors: {
      origin: config.CLIENT_HOST,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    mw.session(socket.request as any, {} as any, next as any);
  });

  io.on("connection", (socket) => {
    // @ts-ignore @todo add socket.io types
    const username = socket.request.session.user?.login;
    if (!username) return;
    emitter.on(`${username}:enrollment:updated`, async (data: Enrollments) => {
      if (!data) return;
      if (!courses.has(data.course_id)) return;
      const courseConfig = courses[data.course_id];
      const course = new Course(courseConfig, data, config.SERVER_HOST);
      const compiledCourse = await course.compile();
      socket.emit("course:update", {
        courseId: data.course_id,
        course: compiledCourse,
      });
    });
  });
};

async function build(files: any) {
  let bundle;
  let buildFailed = false;
  try {
    // create a bundle
    bundle = await rollup({
      input: "config.ts",
      plugins: [
        virtual({
          "tsconfig.json": JSON.stringify(defaultTsConfig, null, 4),
          ...files,
        }),
        swc({
          jsc: {
            parser: {
              syntax: "typescript",
            },
            target: "es2018",
          },
        }),
      ],
    });
    console.log("................ppp", bundle);
    // an array of file names this bundle depends on
    console.log(bundle.watchFiles, "watched files");

    await generateOutputs(bundle, outputOptions);
  } catch (error) {
    buildFailed = true;
    // do some error reporting
    console.error(error);
  }
  if (bundle) {
    // closes the bundle
    await bundle.close();
  }
  process.exit(buildFailed ? 1 : 0);
}

const outputOptions = { dir: "output", format: "cjs" };

async function generateOutputs(bundle, outputOptions) {
  // generate output specific code in-memory
  // you can call this function multiple times on the same bundle object
  // replace bundle.generate with bundle.write to directly write to disk
  const { output } = await bundle.generate(outputOptions);

  for (const chunkOrAsset of output) {
    if (chunkOrAsset.type === "asset") {
      console.log("Asset", chunkOrAsset);
    } else {
      console.log("Chunk", chunkOrAsset.modules);
    }
  }
}

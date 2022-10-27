import request from "supertest";
import createServer from "../src/app";
import { prepareServer } from "../src/index";

beforeAll(async () => {
  console.log(process.env.DATABASE_URL, "DATABASE_URL");
  await prepareServer();
});

jest.setTimeout(10000);

jest.mock("../src/middlewares/user-session", () => {
  return {
    __esModule: true,
    userSession: jest.fn((req, res, next) => {
      req.locals.user = {
        auth: "auth",
        login: "alaa-yahia",
      };
      next();
    }),
  };
});

jest.mock("../src/middlewares/course", () => {
  return {
    __esModule: true,
    course: jest.fn((req, res, next) => {
      const id = req.params.id;
      if (id === "course") {
        req.locals.course = {
          id: "course",
          repo: "coworker-tools",
          title: "Coworker Discovery Tools",
          module: "JS2",
          summary: "./website/intro.md",
          stages: [],
        };
      }
      next();
    }),
  };
});

jest.mock("../src/services/courses", () => {
  return {
    ...jest.requireActual("../src/services/courses"),
    loadRegisteredCourses: jest
      .fn()
      .mockReturnValue(["https://github.com/alaa-yahia/course"]),
  };
});

describe("Getting all courses", () => {
  test("Should get all the courses", async () => {
    const res = await request(createServer()).get("/api/courses");
    expect(Array.isArray(res.body.courses)).toBe(true);
  });
});

describe("Getting specific course", () => {
  test("Should return a 404", async () => {
    await request(createServer()).get("/api/courses/popo").expect(404);
  });
});

test("Should return a course", async () => {
  const data = { course: "https://github.com/alaa-yahia/course" };
  await request(createServer()).post("/api/courses").send(data).expect(200);
  await request(createServer()).get("/api/courses/course").expect(200);
});

describe("Enroll in specific course", () => {
  test("Should return a 404 if course not found", async () => {
    await request(createServer()).post("/api/courses/popo").expect(404);
  });
});

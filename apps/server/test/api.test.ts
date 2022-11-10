import request from "supertest";
import { ProbotOctokit } from "probot";
import nock from "nock";
import { generateGhContentsApiNocks } from "@local/nock-github-contents";
import createServer from "../src/app";
import { prepareServer } from "../src/index";
import * as config from "../src/config";
import createdRepo from "./fixtures/created-repo";
import { db, enrollments, courses } from "../src/services/db";
import { resolve } from "path";

beforeAll(async () => {
  await prepareServer();
});

jest.mock("../src/middlewares/user-session", () => {
  return {
    __esModule: true,
    userSession: jest.fn(async (req, res, next) => {
      const octokit = new ProbotOctokit({
        auth: { token: config.GITHUB_AUTH },
      });
      const data = await octokit.users.getAuthenticated();
      req.locals.user = {
        ...data.data,
        octokit,
      };
      req.session = {};
      req.session.user = req.locals.user;
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
        req.locals.course = req.session.course = {
          id: "course",
          repo: "coworker-tools",
          title: "Coworker Discovery Tools",
          module: "JS2",
          summary: "./website/intro.md",
          stages: [],
        };
        req.session.course = req.locals.course;
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
  test("Should return a course", async () => {
    await generateGhContentsApiNocks(
      resolve(__dirname, "../../../", "courses/course"),
      "course",
      "alaa-yahia"
    );
    const data = { course: "https://github.com/alaa-yahia/course" };
    await request(createServer()).post("/api/courses").send(data).expect(200);
    await request(createServer()).get("/api/courses/course").expect(200);
  });
});

describe("Enroll in specific course", () => {
  nock("https://api.github.com", { allowUnmocked: true })
    .post("/user/repos", {
      name: "coworker-tools",
      auto_init: true,
    })
    .reply(201, createdRepo);

  test("Should return 404 if course not found", async () => {
    await request(createServer()).post("/api/courses/popo").expect(404);
  });

  test("Should return 201 when user enrolled in a course", async () => {
    await request(createServer()).post("/api/courses/course").expect(201);

    expect(
      await enrollments(db).findOne({
        username: "alaa-yahia",
        course_id: "course",
      })
    ).toMatchObject({
      bots: [],
      course_id: "course",
      hooks: {},
      milestones: [],
      repo_url: "https://github.com/alaa-yahia/coworker-tools",
      username: "alaa-yahia",
    });
  });
});

describe("Register a new course", () => {
  test("Should return 200 when registering a new course", async () => {
    await generateGhContentsApiNocks(
      resolve(__dirname, "../../../", "courses/course"),
      "course",
      "alaa-yahia"
    );
    const data = { course: "https://github.com/alaa-yahia/course" };
    await request(createServer()).post("/api/courses").send(data).expect(200);
    expect(
      await courses(db).findOne({
        course_url: "https://github.com/alaa-yahia/course",
      })
    ).toBeDefined();
  });
});

describe("Unenroll from a course", () => {
  test("Should return 204 when user Unenrolled from a course", async () => {
    nock("https://api.github.com", { allowUnmocked: true })
      .delete("/repos/alaa-yahia/coworker-tools")
      .reply(204);
    await request(createServer()).delete("/api/courses/course").expect(204);

    expect(
      await enrollments(db).findOne({
        username: "alaa-yahia",
        course_id: "course",
      })
    ).toBeNull();
  });
});

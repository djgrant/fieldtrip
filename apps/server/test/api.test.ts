import request from "supertest";
import { ProbotOctokit } from "probot";
import nock from "nock";
import { generateGhContentsApiNocks } from "@local/nock-github-contents";
import createServer from "../src/app";
import { prepareServer } from "../src/index";
import {
  testCourseOwner,
  testCourseName,
  testCourseUrl,
  testCourseRepo,
  GITHUB_AUTH,
} from "../src/config";
import createdRepo from "./fixtures/created-repo";
import createdCourse from "./fixtures/created-course";
import compiledCourse from "./fixtures/compiled-course";
import { resolve } from "path";

beforeAll(async () => {
  await prepareServer();
});
jest.setTimeout(15000);
jest.mock("../src/middlewares/user-session", () => {
  return {
    __esModule: true,
    userSession: jest.fn(async (req, _, next) => {
      const octokit = new ProbotOctokit({
        auth: { token: GITHUB_AUTH },
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
    course: jest.fn((req, _, next) => {
      const id = req.params.id;
      if (id === testCourseName) {
        req.locals.course = req.session.course = compiledCourse;
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
      resolve(__dirname, "../../../", `courses/${testCourseName}`),
      testCourseName,
      testCourseOwner
    );
    const data = { course: testCourseUrl };
    await request(createServer()).post("/api/courses").send(data).expect(200);
    await request(createServer())
      .get(`/api/courses/${testCourseName}`)
      .expect(200);
  });
});

describe("Enroll in specific course", () => {
  nock("https://api.github.com", { allowUnmocked: true })
    .post("/user/repos", {
      name: testCourseRepo,
      auto_init: true,
    })
    .reply(201, createdRepo);

  test("Should return 404 if course not found", async () => {
    await request(createServer()).post("/api/courses/popo").expect(404);
  });

  test("Should return 201 when user enrolled in a course", async () => {
    const t = await request(createServer())
      .post(`/api/courses/${testCourseName}`)
      .expect(201);
  });
});

describe("Register a new course", () => {
  test("Should return 200 when registering a new course", async () => {
    await generateGhContentsApiNocks(
      resolve(__dirname, "../../../", `courses/${testCourseName}`),
      testCourseName,
      testCourseOwner
    );
    const data = { course: testCourseUrl };
    await request(createServer()).post("/api/courses").send(data).expect(200);
    const res = await request(createServer())
      .get(`/api/courses/${testCourseName}`)
      .expect(200);
    expect(res.body).toEqual(expect.objectContaining(createdCourse));
  });
});

describe("Unenroll from a course", () => {
  test("Should return 204 when user Unenrolled from a course", async () => {
    nock("https://api.github.com", { allowUnmocked: true })
      .delete(`/repos/${testCourseOwner}/${testCourseRepo}`)
      .reply(204);
    await request(createServer()).delete("/api/courses/course").expect(204);
    const res = await request(createServer())
      .get("/api/courses/course")
      .expect(200);
    expect(res.body.enrollment).toBeUndefined();
  });
});

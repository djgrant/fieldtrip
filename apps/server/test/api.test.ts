import { instance as axios } from "./setup";
import { userSession } from "../src/middlewares/user-session";

jest.mock("../src/middlewares/user-session", () => {
  return {
    __esModule: true,
    userSession: jest.fn((req, res, next) => {
      req.locals.user = {
        auth: "auth",
      };
      next();
    }),
  };
});

describe("Getting all courses", () => {
  test("Should get all the courses", async () => {
    const response = await axios.get("api/courses");

    expect(response.data).toEqual({
      courses: [
        {
          id: expect.any(String),
          repo: expect.any(String),
          title: expect.any(String),
          module: expect.any(String),
          summary: expect.any(String),
          stages: expect.any(Array),
        },
      ],
    });
  });
});

describe("Getting specific course", () => {
  test("Should return a 404", async () => {
    const response = await axios.get("api/courses/popopo");
    expect(response.status).toBe(404);
  });

  test("Should return a course", async () => {
    /* jest.mock("../src/middlewares/user-session", () =>
      jest.fn((req, res, next) => {
        req.locals.user = {
          auth: "auth",
        };
        next();
      })
    ); */
    const res = await axios.post("http://localhost:4000/api/courses/opop");
    const response = await axios.get("api/courses/js2");
    console.log({ res });
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      id: expect.any(String),
      repo: expect.any(String),
      title: expect.any(String),
      module: expect.any(String),
      summary: expect.any(String),
      stages: expect.any(Array),
    });
  });
});

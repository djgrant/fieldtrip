import express from "express";
import { Course } from "src/services/course";
import { db, enrollments, events, tasks, courses } from "src/services/db";
import { SERVER_HOST } from "src/config";
import coursesObj from "@local/courses";

export const api = express.Router();

api.use(express.json());

api.get("/user", async (req, res) => {
  const { user } = req.locals;
  if (!user) {
    res.sendStatus(401);
  } else {
    res.json({
      login: user.login,
      avatar_url: user.avatar_url,
    });
  }
});

api.get("/courses", async (req, res) => {
  res.json(Object.keys(coursesObj));
});

api.get("/courses/:id", async (req, res, next) => {
  const courseConfig = req.locals.course;
  if (!courseConfig) return res.send(404);
  try {
    const state = req.locals.enrollmentKey
      ? await enrollments(db).findOne(req.locals.enrollmentKey)
      : null;
    const course = new Course(courseConfig, state, SERVER_HOST);
    const compiledCourse = await course.compile();
    res.send(compiledCourse);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

api.post("/courses/:id", async (req, res, next) => {
  const { user, course } = req.locals;

  if (!user) return res.sendStatus(403);
  if (!course) return res.sendStatus(404);

  try {
    // Insert must come first so that the row is available to webhook events
    await enrollments(db).insert({
      ...req.locals.enrollmentKey,
      repo_url: `https://github.com/${user.login}/${course.repo}`,
    });
    await user.octokit.request("POST /user/repos", {
      name: course.repo,
      auto_init: true,
    });
    res.sendStatus(201);
  } catch (err) {
    // if this fails it could mean:
    // a) repo already exists
    // b) user uninstall the root app, but didn't revoke its oauth privileges
    // c) the db failed to insert
    next(err);
  }
});

api.delete("/courses/:id", async (req, res, next) => {
  const { user, course, enrollmentKey } = req.locals;
  if (!user || !enrollmentKey) return res.send(403);
  if (!course) return res.send(400);
  try {
    await user.octokit.request("DELETE /repos/{username}/{name}", {
      username: user.login,
      name: course.repo,
    });
    await enrollments(db).delete(enrollmentKey);
    await events(db).delete(enrollmentKey);
    await tasks(db).delete({
      name: `trigger:${enrollmentKey.course_id}:${enrollmentKey.username}`,
    });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

api.post("/courses", async (req, res, next) => {
  const { user, course } = req.locals;
  console.log(coursesObj, "local");
  /*   if (!user) return res.sendStatus(403);
  if (!course) return res.sendStatus(404); */

  try {
    // Insert must come first so that the row is available to webhook events
    /*     await courses(db).insert({
      course_name: `https://github.com/${user.login}/${course.repo}`,
    });
    await user.octokit.request("POST /user/repos", {
      name: course.repo,
      auto_init: true,
    });*/
    res.sendStatus(201);
  } catch (err) {
    // if this fails it could mean:
    // a) repo already exists
    // b) user uninstall the root app, but didn't revoke its oauth privileges
    // c) the db failed to insert
    next(err);
  }
});

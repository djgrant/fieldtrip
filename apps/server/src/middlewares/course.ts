import { RequestHandler } from "express";
import courses from "@local/courses";

export const course: RequestHandler = (req, res, next) => {
  const id = req.params.id;
  if (id && courses.has(id)) {
    req.locals.course = courses[id];
  }
  next();
};

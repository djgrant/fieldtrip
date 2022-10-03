import { RequestHandler } from "express";
import { courses } from "src/services/courses";

export const course: RequestHandler = (req, res, next) => {
  const id = req.params.id;
  if (id && courses.has(id)) {
    req.locals.course = courses.get(id);
  }
  next();
};

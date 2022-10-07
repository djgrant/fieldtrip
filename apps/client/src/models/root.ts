import { Instance, SnapshotIn, SnapshotOut } from "mobx-state-tree";
import { types, flow } from "mobx-state-tree";
import { User } from "./user";
import { Course } from "./course";
import { toaster } from "evergreen-ui";
import { api } from "../utils/api";

export const Root = types
  .model({
    user: types.maybeNull(User),
    courses: types.map(Course),
  })
  .actions((self) => ({
    loadUser: flow(function* () {
      try {
        const res = yield api.user();
        if (res.status === 401) return;
        const user = yield res.json();
        self.user = user;
      } catch (err: any) {
        console.log(err);
        toaster.danger("Failed to load user");
      }
    }),
    loadCourse: flow(function* (courseId) {
      const res = yield api.course(courseId);
      if (res.status === 404) {
        throw new Response("Not Found", { status: 404 });
      }
      const course = yield res.json();
      self.courses.put(course);
    }),
  }));

export interface IRoot extends Instance<typeof Root> {}
export interface IRootSnapshotIn extends SnapshotIn<typeof Root> {}
export interface IRootSnapshotOut extends SnapshotOut<typeof Root> {}

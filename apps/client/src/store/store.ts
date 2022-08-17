import { Root } from "../models";

const initialSnapshot = {
  user: null,
  courses: {},
};

export const store = Root.create(initialSnapshot);

if (process.env.NODE_ENV === "development") {
  // @ts-ignore
  window.store = store;
}

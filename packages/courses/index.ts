import js2 from "./js2-coworkers/config";

const courses = { js2: js2 };

export default {
  ...courses,
  has(key: string): key is keyof typeof courses {
    return key in courses;
  },
};

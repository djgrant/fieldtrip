import js2 from "./js2-coworkers/config";

const courses = { js2: js2 };

export default {
  ...courses,
  has(key: string): key is keyof typeof courses {
    return key in courses;
  },
};
//import js2 from "./js2-coworkers/config";
/* import fs from "fs";
import path from "path";

const getAllcourses = (dirName) => {
  const courses = fs
    .readdirSync(dirName)
    .filter((file) => fs.lstatSync(`${__dirname}/${file}`).isDirectory());
  return courses;
};

const courses = {};

const x = getAllcourses(__dirname);
for (const course of x) {
  import(path.join(course, "config")).then((c) => {
    console.log(c, "p");
    courses["js2"] = c;
  });
}
console.log(courses, "courses");
export default {
  ...courses,
  has(key: string): key is keyof typeof courses {
    return key in courses;
  },
}; */

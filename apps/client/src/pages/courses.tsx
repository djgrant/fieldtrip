import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { toaster } from "evergreen-ui";
import { AppLayout } from "../components/templates";
import { Link } from "react-router-dom";
import type { CourseConfig } from "@notation/fieldtrip";

export const Courses = () => {
  const [courses, setCourses] = useState<CourseConfig[]>([]);

  useEffect(() => {
    try {
      const getCourse = async () => {
        const response = await api.courses();
        if (!response.ok) throw new Error(response.status.toString());
        const obj = await response.json();
        setCourses(obj.courses);
      };
      getCourse();
    } catch (err) {
      console.log(err);
      toaster.danger("No Courses available");
    }
  }, []);

  return (
    <AppLayout>
      <h1 className="text-3xl m-3 underline">Courses</h1>
      <div className="flex m-3">
        {Array.isArray(courses) && courses.length > 0 ? (
          <div>
            {courses.map((course) => (
              <Link to={course.id}>
                <div className="border-2 pt-8 rounded px-3">{course.title}</div>
              </Link>
            ))}
          </div>
        ) : (
          <div>No courses</div>
        )}
      </div>
    </AppLayout>
  );
};

import type { FC } from "react";
import { observer } from "mobx-react-lite";
import { AppLayout } from "../components/templates";
import { Container } from "../components/library";
import { CourseHero, CourseStages, CourseRepo } from "../components/app";
import { useMst } from "../store";
import { Announcement } from "../components/app";

interface Props {
  id?: string;
}

export const Course: FC<Props> = observer(({ id }) => {
  const { user, courses } = useMst();
  const course = courses.get(id!);
  if (!course) return <Announcement message="Loading course...." />;
  return (
    <AppLayout>
      <section className="mb-8 bg-slate-50">
        <Container className="py-8">
          <CourseHero course={course} authenticated={Boolean(user)} />
        </Container>
      </section>
      <Container>
        <section>
          <div className="grid gap-10 md:grid-cols-3">
            <div className="col-span-2">
              <CourseStages
                stages={course.stages}
                enrolled={Boolean(course.enrollment)}
              />
            </div>
            <div className="col-span-1 pt-4">
              {course.enrollment && (
                <CourseRepo
                  onDelete={course.delete}
                  enrollment={course.enrollment}
                />
              )}
            </div>
          </div>
        </section>
      </Container>
    </AppLayout>
  );
});

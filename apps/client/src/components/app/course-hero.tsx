import type { FC } from "react";
import type { ICourse } from "../../models";
import { LOGIN_URL } from "../../config";
import { Button, H1, H4, Markdown } from "../library";
import coworkers from "../../assets/coworkers.svg";
import githubIcon from "../../assets/github.svg";

type Props = {
  course: ICourse;
  authenticated: boolean;
};

export const CourseHero: FC<Props> = ({ course, authenticated }) => (
  <div className="grid gap-4 md:gap-0 md:grid-cols-3">
    <div className="col-span-2">
      <div className="space-y-6">
        <div>
          <H4 className="mb-1.5">{course.module} Module Project</H4>
          <H1>{course.title}</H1>
        </div>
        {authenticated ? (
          course.enrollment ? (
            <Button
              variant="outline"
              className="cursor-default hover:!bg-blue-500 bg-blue-500 rounded-2xl !text-white !border-none"
              disabled
            >
              Course started
            </Button>
          ) : (
            <Button onClick={course.enroll}>Start Project</Button>
          )
        ) : (
          <Button onClick={() => (window.location.href = LOGIN_URL)}>
            <img
              src={githubIcon}
              alt="Github mark"
              className="inline-block w-4 mr-2 mb-0.5 color-white"
            />
            Sign in to enroll
          </Button>
        )}
        <div className="text-slate-500">
          <Markdown>{course.summary}</Markdown>
        </div>
      </div>
    </div>
    <div className="order-first col-span-1 md:order-last">
      <img
        src={coworkers}
        alt="coworkers"
        className="w-full h-full sm:max-w-sm md:max-w-full"
      />
    </div>
  </div>
);

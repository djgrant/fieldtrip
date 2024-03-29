import type { Enrollments } from ".";

// @todo break these into input and generated types

export type CourseConfig = {
  id: string;
  repo: string;
  title: string;
  module: string;
  summary: string;
  stages: CourseStage[];
  enrollment?: {
    repoUrl: string;
  };
};

export type CourseStage = {
  key: string;
  label: string;
  summary: ((context: Enrollments | null) => string) | string;
  actions?: CourseAction[];
  milestones?: CourseMilestone[];
  hooks?: CourseHook[];
};

export type CourseAction = {
  id: string;
  label: string;
  url: ((context: Enrollments) => string) | string;
  passed: Passed;
};

export type CourseMilestone = {
  id: string;
  label: string;
  passed: Passed;
};

export type CourseHook = {
  id: string;
  priority?: number;
  hook: Hook;
};

export type Passed =
  | boolean
  | EventAssertion
  | ((context: Enrollments) => boolean);

export type Hook = {
  event: string;
  predicate: (...args: any) => boolean;
  action: (...args: any) => Promise<unknown>;
  botName: string;
};

export type EventAssertion = {
  event: string;
  predicate: (...args: any) => boolean;
  botName: string;
};

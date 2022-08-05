import type { Enrollments } from ".";
export declare type CourseConfig = {
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
export declare type CourseStage = {
    key: string;
    label: string;
    summary: ((context: Enrollments | null) => string) | string;
    actions?: CourseAction[];
    milestones?: CourseMilestone[];
    hooks?: CourseHook[];
};
export declare type CourseAction = {
    id: string;
    label: string;
    url: ((context: Enrollments) => string) | string;
    passed: Passed;
};
export declare type CourseMilestone = {
    id: string;
    label: string;
    passed: Passed;
};
export declare type CourseHook = {
    id: string;
    priority?: number;
    hook: Hook;
};
export declare type Passed = boolean | EventAssertion | ((context: Enrollments) => boolean);
export declare type Hook = {
    event: string;
    predicate: (...args: any) => boolean;
    action: (...args: any) => Promise<unknown>;
    botName: string;
};
export declare type EventAssertion = {
    event: string;
    predicate: (...args: any) => boolean;
    botName: string;
};

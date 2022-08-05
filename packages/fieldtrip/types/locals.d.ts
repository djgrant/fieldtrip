import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import type { Probot } from "probot";
import type { Octokit } from "@octokit/rest";
import type { Bots, CourseConfig } from ".";
export declare type Locals = UnauthenticatedLocals | AuthenticatedLocals;
export declare type UnauthenticatedLocals = {
    course: CourseConfig | null;
    user: null;
    bots: Record<any, never>;
    enrollmentKey: null;
};
export declare type AuthenticatedLocals = {
    course: CourseConfig | null;
    user: User;
    bots: Record<Bots, Bot>;
    enrollmentKey: {
        username: string;
        course_id: string;
    };
};
export declare type Bot = {
    octokit: Awaited<ReturnType<Probot["auth"]>>;
    installationId: number;
};
export declare type User = {
    octokit: Octokit;
} & RestEndpointMethodTypes["users"]["getAuthenticated"]["response"]["data"];

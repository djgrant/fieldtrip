import type {
  EmitterWebhookEvent,
  EmitterWebhookEventName,
} from "@octokit/webhooks";
import type { Issue, PullRequest } from "@octokit/webhooks-types";
import type { Context } from "probot";
import type { Github } from "./github";
import type { Enrollments, EventAssertion, Hook } from "./types";

export type Predicate<E extends EmitterWebhookEventName> = (
  event: EmitterWebhookEvent<E>["payload"],
  state: Enrollments
) => boolean;

export type Action = (github: Github, state: Enrollments) => Promise<unknown>;

export function on<E extends EmitterWebhookEventName>(
  event: E | E[],
  predicate: Predicate<E>
): EventAssertion;

export function on<E extends EmitterWebhookEventName>(
  event: E | E[],
  predicate: Predicate<E>,
  action: Action
): Hook;

export function on<E extends EmitterWebhookEventName>(
  this: string,
  event: string | string[],
  predicate: (...args: any) => boolean,
  action?: (...args: any) => Promise<unknown>
): unknown {
  const botName = this || "fieldtrip";
  return { event, predicate, action, botName };
}

on.amber = on.bind("amber");
on.malachi = on.bind("malachi");
on.uma = on.bind("uma");

export const prRefsIssue = (pr: PullRequest, issue: Issue) => {
  const links = [`#${issue.number}`, issue.html_url];
  return links.some((substr) => pr.body?.includes(substr));
};

export const prByOwner = (event: Context<"pull_request">["payload"]) => {
  return event.repository.owner.login === event.pull_request.user.login;
};

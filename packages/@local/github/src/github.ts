import type { Context as BaseContext } from "probot";
import { getFile } from "@local/markdown";

export type EventContext = Pick<
  BaseContext<InstallationEvents> | BaseContext<RepoEvents>,
  "octokit" | "name" | "payload"
> & {
  repo: <T>(o?: any) => { repo: string; owner: string } & T;
};

type InstallationEvents =
  | "installation.created"
  | "installation_repositories.added";

type RepoEvents = "issues.opened" | "issues.closed";

export class Github {
  context: EventContext;
  octokit: EventContext["octokit"];
  targetRepo: string;

  constructor(context: EventContext, options: { targetRepo: string }) {
    this.context = context;
    this.octokit = context.octokit;
    this.targetRepo = options.targetRepo;
  }

  // Unfortunately, can't add a Type guard here as it's too complex for the compiler
  private get isInstallationEvent() {
    return (
      this.context.name === "installation" ||
      this.context.name === "installation_repositories"
    );
  }

  get installedRepos() {
    if ("repositories_added" in this.context.payload) {
      return this.context.payload.repositories_added || [];
    }
    if ("repositories" in this.context.payload) {
      return this.context.payload.repositories || [];
    }
  }

  private get eventRepo() {
    if (this.isInstallationEvent) {
      return null;
    }
    return this.context.repo().repo;
  }

  get username() {
    return this.repo().owner;
  }

  get eventShouldBeIgnored() {
    if (this.isInstallationEvent) {
      return (
        this.installedRepos?.filter((r) => r.name === this.targetRepo)
          .length === 0
      );
    }
    return this.eventRepo !== this.targetRepo;
  }

  // repo function that can be used on installation events
  repo<T extends Record<string, any>>(
    o?: T
  ): T & { owner: string; repo: string } {
    if (this.isInstallationEvent) {
      return Object.assign({}, o, {
        owner: this.context.payload.sender.login,
        repo: this.targetRepo,
      });
    }
    return this.context.repo<T>(o);
  }

  private get fileProps() {
    return {
      user: `@${this.username}`,
      username: this.username,
      repo: this.targetRepo,
    };
  }

  private async maybeMarkdown(pathOrBody: string) {
    if (pathOrBody.split("?")[0]?.endsWith(".md")) {
      return getFile(pathOrBody, this.fileProps);
    }
    return pathOrBody;
  }

  private async fileToBase64(path: string, props?: Record<string, string>) {
    const content = await getFile(path, { ...this.fileProps, ...props });
    return Buffer.from(content).toString("base64");
  }

  async createIssue(params: {
    title: string;
    body: string;
    assignee?: string;
  }) {
    const { title, body } = params;
    const { data } = await this.octokit.issues.create(
      this.repo({
        title,
        body: await this.maybeMarkdown(body),
        assignee: params.assignee,
      })
    );
    return data;
  }

  async createIssueComment(params: { issueNumber: number; body: string }) {
    const { issueNumber, body } = params;
    const { data } = await this.octokit.issues.createComment(
      this.repo({
        issue_number: issueNumber,
        body: await this.maybeMarkdown(body),
      })
    );
    return data;
  }

  async createProject(params: { name: string; body: string }) {
    const { name, body } = params;
    const { data } = await this.octokit.projects.createForRepo(
      this.repo({
        name,
        body: await this.maybeMarkdown(body),
      })
    );
    return data;
  }

  async createProjectColumn(params: { projectId: number; name: string }) {
    const { projectId, name } = params;
    const { data } = await this.octokit.projects.createColumn(
      this.repo({
        project_id: projectId,
        name,
      })
    );
    return data;
  }

  async createProjectCard(params: {
    columnId: number;
    issueId: number;
    position?: "top" | "bottom" | `after:${string}`;
  }) {
    const { columnId, issueId, position } = params;
    const { data } = await this.octokit.projects.createCard(
      this.repo({
        column_id: columnId,
        content_id: issueId,
        content_type: "Issue",
      })
    );
    await this.octokit.projects.moveCard(
      this.repo({
        card_id: data.id,
        position: position || "bottom",
        column_id: columnId,
      })
    );
    return data;
  }

  async moveProjectCard(params: {
    cardId: number;
    columnId: number;
    position?: "top" | "bottom" | `after:${string}`;
  }) {
    const { cardId, columnId, position } = params;
    await this.octokit.projects.moveCard(
      this.repo({
        card_id: cardId,
        position: position || "bottom",
        column_id: columnId,
      })
    );
  }

  async createPullRequest(params: {
    from: string;
    to: string;
    title: string;
    body: string;
    reviewers?: string[];
  }) {
    const pull = await this.octokit.pulls.create(
      this.repo({
        title: params.title,
        body: await this.maybeMarkdown(params.body),
        reviewers: params.reviewers,
        head: params.from,
        base: params.to,
      })
    );
    await this.octokit.pulls.requestReviewers(
      this.repo({
        pull_number: pull.data.number,
        reviewers: params.reviewers,
      })
    );
    return pull.data;
  }

  async createBranch(branchName: string) {
    const ref = await this.octokit.git.getRef(
      this.repo({
        ref: "heads/main",
      })
    );

    return await this.octokit.git.createRef(
      this.repo({
        ref: `refs/heads/${branchName}`,
        sha: ref.data.object.sha,
      })
    );
  }

  async putFile(params: {
    path: string;
    message?: string;
    content: string;
    branch: string;
  }) {
    let currentFile;
    try {
      currentFile = await this.octokit.repos.getContent(
        this.repo({
          branch: params.branch,
          path: params.path,
        })
      );
    } catch {
      // assume file doesn't exist and this is a create operation
    }

    const props: Record<string, string> = {};
    if (currentFile) {
      // @ts-ignore content possibly doesn't exist if over a certain size
      const content = currentFile.data.content;
      props.old_content = Buffer.from(content, "base64").toString("utf8");
    }

    return this.octokit.repos.createOrUpdateFileContents(
      this.repo({
        path: params.path,
        message: params.message || `Update ${params.path}`,
        content: await this.fileToBase64(params.content, props),
        branch: params.branch,
        sha:
          currentFile &&
          (Array.isArray(currentFile.data)
            ? currentFile.data[0].sha
            : currentFile.data.sha),
      })
    );
  }
}

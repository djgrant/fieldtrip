'use strict';

var fieldtrip = require('@notation/fieldtrip');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var sprint1Hooks = [
    {
        id: "malachiIntro",
        hook: fieldtrip.on.malachi(["installation_repositories.added", "installation.created"], function () { return true; }, function (malachi) {
            return malachi.createIssue({
                title: "Introducing your product owner",
                body: "sprint1/issues/malachi-intro.md"
            });
        })
    },
    {
        id: "board",
        hook: fieldtrip.on.malachi(["installation_repositories.added", "installation.created"], function () { return true; }, function (malachi) { return __awaiter(void 0, void 0, void 0, function () {
            var project, columnNames, columns, _i, _a, _b, key, label, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, malachi.createProject({
                            name: "Coworker tools",
                            body: "A collection of tools for coworkers"
                        })];
                    case 1:
                        project = _e.sent();
                        columnNames = {
                            todo: "Todo",
                            doing: "In Progress",
                            review: "Review/QA",
                            blocked: "Blocked",
                            done: "Done"
                        };
                        columns = {};
                        _i = 0, _a = Object.entries(columnNames);
                        _e.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        _b = _a[_i], key = _b[0], label = _b[1];
                        _c = columns;
                        _d = key;
                        return [4 /*yield*/, malachi.createProjectColumn({
                                projectId: project.id,
                                name: label
                            })];
                    case 3:
                        _c[_d] = _e.sent();
                        _e.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, {
                            id: project.id,
                            columns: columns
                        }];
                }
            });
        }); })
    },
    {
        id: "setupIssue",
        hook: fieldtrip.on.malachi(["installation_repositories.added", "installation.created"], function () { return true; }, function (malachi) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, malachi.createIssue({
                        title: "Set up repo (Uma)",
                        body: "./sprint1/tasks/set-up-repo.md"
                    })];
            });
        }); })
    },
    {
        id: "setupCard",
        hook: fieldtrip.on.malachi("issues.opened", function (event, state) { return event.issue.id === state.hooks.setupIssue.id; }, function (malachi, state) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, malachi.createProjectCard({
                        columnId: state.hooks.board.columns.todo.id,
                        issueId: state.hooks.setupIssue.id
                    })];
            });
        }); })
    },
    {
        id: "storeDataIssue",
        hook: fieldtrip.on.malachi(["installation_repositories.added", "installation.created"], function () { return true; }, function (malachi) {
            return malachi.createIssue({
                title: "Store member data for use in digital tools",
                body: "./sprint1/tasks/store-data.md"
            });
        })
    },
    {
        id: "storeDataCard",
        hook: fieldtrip.on.malachi("issues.opened", function (event, state) { return event.issue.id === state.hooks.storeDataIssue.id; }, function (malachi, state) {
            var issue = state.hooks.storeDataIssue;
            return malachi.createProjectCard({
                columnId: state.hooks.board.columns.todo.id,
                issueId: issue.id,
                position: "bottom"
            });
        })
    },
    {
        id: "listCommandIssue",
        hook: fieldtrip.on.malachi(["installation_repositories.added", "installation.created"], function () { return true; }, function (malachi) {
            return malachi.createIssue({
                title: "Create CLI command to list members",
                body: "./sprint1/tasks/list-command.md"
            });
        })
    },
    {
        id: "listCommandCard",
        hook: fieldtrip.on.malachi("issues.opened", function (event, state) { return event.issue.id === state.hooks.listCommandIssue.id; }, function (malachi, state) {
            var issue = state.hooks.listCommandIssue;
            return malachi.createProjectCard({
                columnId: state.hooks.board.columns.todo.id,
                issueId: issue.id,
                position: "bottom"
            });
        })
    },
    {
        id: "umaIntro",
        hook: fieldtrip.on.uma(["installation_repositories.added", "installation.created"], function () { return true; }, function (uma) {
            return uma.createIssue({
                title: "Introducing your technical lead",
                body: "sprint1/issues/uma-intro.md"
            });
        })
    },
    {
        id: "storeDataCardComment",
        hook: fieldtrip.on.uma(["installation_repositories.added", "installation.created"], function () { return true; }, function (uma, state) { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, uma.createIssueComment({
                            issueNumber: (_a = state.hooks.storeDataIssue) === null || _a === void 0 ? void 0 : _a.number,
                            body: "./sprint1/tasks/store-data-comment.md"
                        })];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); })
    },
    {
        id: "setupPr",
        hook: fieldtrip.on.uma(["installation_repositories.added", "installation.created"], function () { return true; }, function (uma, state) { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, uma.moveProjectCard({
                            cardId: state.hooks.setupCard.id,
                            columnId: state.hooks.board.columns.review.id
                        })];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, uma.createBranch("setup-repo")];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, uma.putFile({
                                path: "README.md",
                                content: "sprint1/prs/repo-setup/README.md",
                                branch: "setup-repo"
                            })];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, uma.putFile({
                                path: "members.js",
                                content: "sprint1/prs/repo-setup/members.js",
                                branch: "setup-repo"
                            })];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, uma.putFile({
                                path: ".github/pull_request_template.md",
                                content: "sprint1/prs/repo-setup/pull_request_template.md",
                                branch: "setup-repo"
                            })];
                    case 5:
                        _b.sent();
                        return [2 /*return*/, uma.createPullRequest({
                                from: "setup-repo",
                                to: "main",
                                title: "Set up repo",
                                body: "sprint1/prs/repo-setup/description.md?issueNumber=".concat((_a = state.hooks.setupIssue) === null || _a === void 0 ? void 0 : _a.number),
                                reviewers: [uma.username]
                            })];
                }
            });
        }); })
    },
    {
        id: "moveSetupCardToDone",
        priority: 0,
        hook: fieldtrip.on.uma("pull_request.closed", function (event, state) { return event.pull_request.id === state.hooks.setupPr.id; }, function (amber, state) {
            return amber.moveProjectCard({
                cardId: state.hooks.setupCard.id,
                columnId: state.hooks.board.columns.done.id
            });
        })
    },
    {
        id: "amberIntro",
        hook: fieldtrip.on.amber(["installation_repositories.added", "installation.created"], function () { return true; }, function (amber) {
            return amber.createIssue({
                title: "Introducing your scrum master",
                body: "sprint1/issues/amber-intro.md"
            });
        })
    },
    {
        id: "cliPr",
        hook: fieldtrip.on.uma("project_card.moved", function (event, state) {
            var cols = state.hooks.board.columns;
            var isDataCard = event.project_card.id === state.hooks.storeDataCard.id;
            var devDone = [cols.review.id, cols.done.id].includes(event.project_card.column_id);
            return isDataCard && devDone;
        }, function (uma, state) { return __awaiter(void 0, void 0, void 0, function () {
            var pr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, uma.createBranch("setup-cli")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, uma.putFile({
                                path: "README.md",
                                content: "sprint1/prs/cli-setup/README.md",
                                branch: "setup-cli"
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, uma.putFile({
                                path: "cli.js",
                                content: "sprint1/prs/cli-setup/cli.js",
                                branch: "setup-cli"
                            })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, uma.putFile({
                                path: "package.json",
                                content: "sprint1/prs/cli-setup/package.json",
                                branch: "setup-cli"
                            })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, uma.createPullRequest({
                                from: "setup-cli",
                                to: "main",
                                title: "Set up CLI",
                                body: "sprint1/prs/cli-setup/description.md?issueNumber=".concat(state.hooks.listCommandIssue.number),
                                reviewers: [uma.username]
                            })];
                    case 5:
                        pr = _a.sent();
                        return [4 /*yield*/, uma.createIssueComment({
                                issueNumber: state.hooks.listCommandIssue.number,
                                body: "./sprint1/tasks/list-command-comment.md?prNumber=".concat(pr.number)
                            })];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, pr];
                }
            });
        }); })
    },
];

var sprint1Milestones = [
    {
        id: "merge-repo-setup-pr",
        label: "Merged Uma's repo setup PR",
        passed: fieldtrip.on("pull_request.closed", function (event, state) { return event.pull_request.id === state.hooks.setupPr.id; })
    },
    {
        id: "data-issue-assigned-to-self",
        label: "Assigned first issue, *Store member data*, to self",
        passed: fieldtrip.on("issues.assigned", function (event, state) { return event.issue.id === state.hooks.storeDataIssue.id; })
    },
    {
        id: "member-data-card-in-progress",
        label: "Moved *Store member data* card to *In Progress*",
        passed: fieldtrip.on("project_card.moved", function (event, state) {
            return event.project_card.id === state.hooks.storeDataCard.id &&
                event.project_card.column_id === state.hooks.board.columns.doing.id;
        })
    },
    {
        id: "open-member-data-pr",
        label: "Opened PR, referencing *Store member data* issue ",
        passed: fieldtrip.on(["pull_request.opened", "pull_request.edited"], function (event, state) {
            return fieldtrip.prByOwner(event) &&
                fieldtrip.prRefsIssue(event.pull_request, state.hooks.storeDataIssue);
        })
    },
    // {
    //   id: "assigned-member-data-pr",
    //   label: "Assigned reviewer to *Store member data* PR",
    //   passed: on(
    //     "pull_request.review_requested",
    //     (event, state) =>
    //       event.pull_request.requested_reviewers.length > 0 &&
    //       prByOwner(event) &&
    //       prRefsIssue(event.pull_request, state.hooks.storeDataIssue)
    //   ),
    // },
    {
        id: "member-data-card-in-review",
        label: "Moved *Store member data* card to *In Review*",
        passed: fieldtrip.on("project_card.moved", function (event, state) {
            return event.project_card.id === state.hooks.storeDataCard.id &&
                event.project_card.column_id === state.hooks.board.columns.review.id;
        })
    },
    {
        id: "merged-member-data-pr",
        label: "Merged *Store member data* PR (once peer-reviewed)",
        passed: fieldtrip.on("pull_request.closed", function (event, state) {
            return event.pull_request.merged &&
                fieldtrip.prByOwner(event) &&
                fieldtrip.prRefsIssue(event.pull_request, state.hooks.storeDataIssue);
        })
    },
    {
        id: "member-data-card-done",
        label: "Moved *Store member data* card to *Done*",
        passed: fieldtrip.on("project_card.moved", function (event, state) {
            return event.project_card.id === state.hooks.storeDataCard.id &&
                event.project_card.column_id === state.hooks.board.columns.done.id;
        })
    },
    {
        id: "merge-cli-setup-pr",
        label: "Merged Uma's *CLI setup* PR",
        passed: fieldtrip.on("pull_request.closed", function (event, state) { return event.pull_request.id === state.hooks.cliPr.id; })
    },
    {
        id: "list-issue-assigned-to-self",
        label: "Assigned next issue, *CLI list command* to self",
        passed: fieldtrip.on("issues.assigned", function (event, state) { return event.issue.id === state.hooks.listCommandIssue.id; })
    },
    {
        id: "list-card-in-progress",
        label: "Moved *CLI list command* card to *In Progress*",
        passed: fieldtrip.on("project_card.moved", function (event, state) {
            return event.project_card.id === state.hooks.listCommandCard.id &&
                event.project_card.column_id === state.hooks.board.columns.doing.id;
        })
    },
    {
        id: "open-list-pr",
        label: "Opened *CLI list command* PR",
        passed: fieldtrip.on(["pull_request.opened", "pull_request.edited"], function (event, state) {
            return fieldtrip.prByOwner(event) &&
                fieldtrip.prRefsIssue(event.pull_request, state.hooks.listCommandIssue);
        })
    },
    // {
    //   id: "assigned-list-pr",
    //   label: "Assigned reviewer to List Command PR",
    //   passed: on(
    //     "pull_request.assigned",
    //     (event, state) =>
    //       event.pull_request.assignees.length > 0 &&
    //       prByOwner(event) &&
    //       prRefsIssue(event.pull_request, state.hooks.listCommandIssue)
    //   ),
    // },
    {
        id: "list-card-in-review",
        label: "Moved *CLI list command* card to *In Review*",
        passed: fieldtrip.on("project_card.moved", function (event, state) {
            return event.project_card.id === state.hooks.listCommandCard.id &&
                event.project_card.column_id === state.hooks.board.columns.review.id;
        })
    },
    {
        id: "list-pr-merged",
        label: "Merged *CLI list command* PR (once peer-reviewed)",
        passed: fieldtrip.on("pull_request.closed", function (event, state) {
            return event.pull_request.merged &&
                fieldtrip.prByOwner(event) &&
                fieldtrip.prRefsIssue(event.pull_request, state.hooks.listCommandIssue);
        })
    },
    {
        id: "list-card-done",
        label: "Moved *CLI list command* card to Done",
        passed: fieldtrip.on("project_card.moved", function (event, state) {
            return event.project_card.id === state.hooks.listCommandCard.id &&
                event.project_card.column_id === state.hooks.board.columns.done.id;
        })
    },
];

var sprint1Actions = [
    {
        id: "add-malachi",
        label: "Add Malachi Bot to your repo",
        url: "/auth/install/malachi",
        passed: function (state) { return state.bots.includes("malachi"); }
    },
    {
        id: "meet-malachi",
        label: "Meet Malachi",
        url: function (state) { return state.hooks.malachiIntro.html_url; },
        passed: fieldtrip.on("issues.closed", function (event, state) { return event.issue.number === state.hooks.malachiIntro.number; })
    },
    {
        id: "add-uma",
        label: "Add Uma Bot to your repo",
        url: "/auth/install/uma",
        passed: function (state) { return state.bots.includes("uma"); }
    },
    {
        id: "meet-uma",
        label: "Meet Uma",
        url: function (state) { return state.hooks.umaIntro.html_url; },
        passed: fieldtrip.on("issues.closed", function (event, state) { return event.issue.number === state.hooks.umaIntro.number; })
    },
    {
        id: "add-amber",
        label: "Add Amber Bot to your repo",
        url: "/auth/install/amber",
        passed: function (state) { return state.bots.includes("amber"); }
    },
    {
        id: "meet-amber",
        label: "Meet Amber",
        url: function (state) { return state.hooks.amberIntro.html_url; },
        passed: fieldtrip.on("issues.closed", function (event, state) { return event.issue.number === state.hooks.amberIntro.number; })
    },
];

var sprint1 = {
    key: "sprint-1",
    label: "Sprint 1",
    summary: function (state) {
        return state ? "./website/sprint1-enrolled.md" : "./website/sprint1.md";
    },
    actions: sprint1Actions,
    milestones: sprint1Milestones,
    hooks: sprint1Hooks
};

var sprint2 = {
    key: "sprint-2",
    label: "Sprint 2",
    summary: "./website/sprint2.md",
    actions: []
};

var sprint3 = {
    key: "sprint-3",
    label: "Sprint 3",
    summary: "./website/sprint3.md",
    actions: []
};

var config = {
    id: "js2",
    repo: "coworker-tools",
    title: "Coworker Discovery Tools",
    module: "JS2",
    summary: "./website/intro.md",
    stages: [sprint1, sprint2, sprint3]
};

module.exports = config;

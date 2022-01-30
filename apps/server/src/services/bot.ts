import { Probot } from "probot";
import PQueue from "p-queue";
import courses from "@packages/courses";
import { Course } from "../services/course";
import { Github } from "../services/github";
import { Store } from "../services/store";
import { createProbot } from "../utils";
import { bots } from "../config";
import type { Bots } from "@packages/courses/types";

// @todo get course using event payload repo
const course = courses.js2;

const hooks = Course.getHooks(course);
const hooksByBotName = hooks.reduce((acc, hook) => {
  if (!acc[hook.hook.botName]) acc[hook.hook.botName] = [];
  acc[hook.hook.botName].push(hook);
  return acc;
}, {} as Record<string, ReturnType<typeof Course.getHooks>>);

// @todo this should probably be refactored into a proper queue
// so that it can be guaranteed that steps will be excecuted in their declared order
const q = new PQueue({ concurrency: 1 });

export const createBot = (botName: Bots) => {
  const botHooks = hooksByBotName[botName];

  const app = (app: Probot) => {
    if (!botHooks) return;

    for (let i = 0; i < botHooks.length; i++) {
      const hook = botHooks[i];
      const { event, predicate, action } = hook.hook;

      app.on(event as any, async (context) => {
        const github = new Github(context, course.repo);
        if (github.eventShouldBeIgnored) return;
        const store = new Store(github.repo());
        const state = await store.getAll();

        if (state.passed.includes(hook.id)) return;

        let passed;
        try {
          passed = predicate(context.payload, state, github);
        } catch (err) {
          passed = false;
        }

        if (!passed) return;

        if (action) {
          await q.add(
            async () => {
              console.log(`Executing ${hook.id}`);
              const result = await action(github, await store.getAll());
              await store.set(["hooks", hook.id], result);
            },
            { priority: botHooks.length - i }
          );
        }

        await store.add("passed", hook.id);
      });
    }
  };

  return {
    app,
    instance: createProbot(bots[botName]),
    config: bots[botName],
  };
};

import type {
  CourseConfig,
  CourseHook,
  EventAssertion,
} from "@notation/fieldtrip";
import type { Bots } from "src/types";
import { Probot } from "probot";
import { Github } from "@local/github";
import { Course } from "src/services/course";
import { bots } from "src/config";
import { actionRegister, taskq } from "src/services";
import { db, enrollments, events } from "src/services/db";
import { createProbot } from "src/utils";
import { courses } from "src/services/courses";

const getTriggersByBotName = (course: CourseConfig) => {
  if (!course) {
    return;
  }
  const triggers: (CourseHook | { id: string; hook: EventAssertion })[] =
    Course.getHooks(course);

  let i = 0;
  const triggersByBotName = {} as Record<
    string,
    { priority: number; trigger: ReturnType<typeof Course.getHooks>[number] }[]
  >;
  for (const trigger of triggers) {
    if (!triggersByBotName[trigger.hook.botName]) {
      triggersByBotName[trigger.hook.botName] = [];
    }
    if ("action" in trigger.hook) {
      let priority =
        "priority" in trigger && typeof trigger.priority === "number"
          ? trigger.priority
          : i++;

      triggersByBotName[trigger.hook.botName].push({
        // give priority (sequence position) to triggers with an action so that they are executed sequentially
        priority,
        trigger,
      });
    } else {
      triggersByBotName[trigger.hook.botName].push({ trigger, priority: 0 });
    }
  }
  return triggersByBotName;
};

export const createBot = (
  botName: Bots,
  statickHooks?: (app: Probot) => void
) => {
  const app = (app: Probot) => {
    // @todo get course using event payload repo
    const course = courses.get("js2");

    const triggersByBotName = getTriggersByBotName(course) || {};

    const botTriggers = triggersByBotName[botName];
    if (statickHooks) statickHooks(app);

    if (!botTriggers) return;
    for (const botTrigger of botTriggers) {
      const { trigger, priority } = botTrigger;
      const { event, predicate } = trigger.hook;

      app.on(event as any, async (context) => {
        const github = new Github(context, { targetRepo: course.repo });
        console.log(botTriggers, "mnmnmn");
        if (github.eventShouldBeIgnored) return;

        // wait for actions to finish to ensure state is up-to-date
        actionRegister.flushed(async function runTrigger() {
          const state = await enrollments(db).findOneRequired({
            username: github.username,
            course_id: course.id,
          });

          if (state.milestones.includes(trigger.id)) return;
          let passed;
          try {
            passed = predicate(context.payload, state, github);
          } catch {
            passed = false;
          }

          if (!passed) return;

          try {
            const [event] = await events(db).insert({
              trigger_id: trigger.id,
              username: github.username,
              course_id: course.id,
              event_name: context.name,
              payload: context.payload,
              bot_name: botName,
              installation_id: context.payload.installation.id,
            });

            await taskq.enqueue({
              name: `trigger:${course.id}:${github.username}`,
              status: "sequenced",
              priority,
              params: {
                event: {
                  trigger_id: event.trigger_id,
                  username: event.username,
                  course_id: event.course_id,
                },
              },
            });
          } catch (err: any) {
            if (err.code === "23505") {
              // duplicate key error
              // this is not an error, it just means that the event has already been processed
              return;
            }
            throw err;
          }
        });
      });
    }
  };

  return {
    app,
    instance: createProbot(bots[botName]),
    config: bots[botName],
  };
};

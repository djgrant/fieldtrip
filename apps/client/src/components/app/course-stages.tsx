import { Markdown /* Tab, Tabs, TabPage */ } from "src/components/library";
import { CourseActions, CourseMilestones } from ".";
import { observer } from "mobx-react-lite";
import type { ICourseStage } from "src/models";
import * as Tabs from "@radix-ui/react-tabs";

type Props = {
  enrolled: boolean;
  stages: ICourseStage[];
};

export const CourseStages = observer(({ stages, enrolled }: Props) => (
  <div className="w-3/4">
    <Tabs.Root defaultValue={stages[0].label} orientation="vertical">
      <div className="flex space-x-5 border-b-2 tabTrigger ">
        {stages.map((stage, i) => (
          <Tabs.List>
            <Tabs.Trigger className="pb-3" value={stage.label}>
              {stage.label}
            </Tabs.Trigger>
          </Tabs.List>
        ))}
      </div>
      <div>
        {stages.map((stage, i) => (
          <Tabs.Content value={stage.label}>
            <div>
              <Markdown>{stage.summary}</Markdown>
              {stage.actions.length > 0 && enrolled && (
                <CourseActions stage={stage} />
              )}
              {stage.milestones.length > 0 && enrolled && (
                <CourseMilestones stage={stage} />
              )}
            </div>
          </Tabs.Content>
        ))}
      </div>
    </Tabs.Root>
  </div>
));

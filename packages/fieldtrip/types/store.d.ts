import type { Bots } from ".";
export declare type StoreData = {
    courseId: string;
    enrollment: {
        username: string;
        repoUrl: string;
    } | null;
    passed: string[];
    installedBots: Bots[];
    hooks: Record<string, any>;
};

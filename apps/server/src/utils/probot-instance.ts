import { createProbot as createProbotOrig } from "probot";

import type { BotConfig } from "../config";
import * as config from "../config";
import { getLog } from "./logger";

export const createProbot = (botConfig: BotConfig) => {
  if (config.isDev && botConfig.WEBHOOK_PROXY_URL) {
    const SmeeClient = require("smee-client");
    const smee = new SmeeClient({
      source: botConfig.WEBHOOK_PROXY_URL,
      target: `http://localhost:${config.PORT}${botConfig.WEBHOOK_PATH}`,
    });
    smee.start();
  }
  return createProbotOrig({
    overrides: {
      appId: botConfig.APP_ID,
      privateKey: botConfig.PRIVATE_KEY,
      secret: botConfig.WEBHOOK_SECRET,
      log: getLog(),
    },
  });
};

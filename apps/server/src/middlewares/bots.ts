import type { ApplicationFunction } from "probot/lib/types";
import type { Probot } from "probot";
import type { BotConfig } from "src/config";
import express from "express";
import { createNodeMiddleware } from "probot";

type Bot = {
  app: ApplicationFunction;
  instance: Probot;
  config: BotConfig;
};

const probot = (params: {
  app: ApplicationFunction;
  instance: Probot;
  config: BotConfig;
}) => {
  return express().use(
    createNodeMiddleware(params.app, {
      probot: params.instance,
      webhooksPath: params.config.WEBHOOK_PATH,
    })
  );
};

export const bots = (bots: {
  fieldtrip: Bot;
  malachi: Bot;
  uma: Bot;
  amber: Bot;
}) => {
  const fieldtrip = probot(bots.fieldtrip);
  const malachi = probot(bots.malachi);
  const uma = probot(bots.uma);
  const amber = probot(bots.amber);
  return { fieldtrip, malachi, uma, amber };
};

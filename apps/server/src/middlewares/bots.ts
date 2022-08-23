import type { ApplicationFunction } from "probot/lib/types";
import type { Probot } from "probot";
import type { BotConfig } from "src/config";
import express from "express";
import { createNodeMiddleware } from "probot";
import * as bots from "src/services/bots";

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

export const fieldtrip = probot(bots.fieldtrip);
export const malachi = probot(bots.malachi);
export const uma = probot(bots.uma);
export const amber = probot(bots.amber);

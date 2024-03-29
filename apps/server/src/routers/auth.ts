import { Router } from "express";
import { URLSearchParams } from "url";
import { createOAuthUserAuth } from "@octokit/auth-oauth-user";
import { createAppAuth } from "@octokit/auth-app";
import * as config from "src/config";
import { ProbotOctokit } from "probot";

export const auth = Router();

auth.get("/login", async (_, res) => {
  const params = new URLSearchParams({
    client_id: config.bots.fieldtrip.GITHUB_CLIENT_ID,
    redirect_uri: `${config.SERVER_HOST}/auth/login/cb`,
  }).toString();

  const url = `https://github.com/login/oauth/authorize?${params}`;
  res.redirect(url);
});

auth.get("/login/cb", async (req, res, next) => {
  try {
    const getUserAuth = createOAuthUserAuth({
      clientId: config.bots.fieldtrip.GITHUB_CLIENT_ID,
      clientSecret: config.bots.fieldtrip.GITHUB_CLIENT_SECRET,
      code: req.query.code as string,
    });
    const userAuth = await getUserAuth();
    const userOctokit = new ProbotOctokit({ auth: userAuth });
    const { data: user } = await userOctokit.users.getAuthenticated();

    req.session!.user = {
      id: user.id,
      login: user.login,
      auth: userAuth,
    };

    try {
      const getAppAuth = createAppAuth({
        appId: config.bots.fieldtrip.APP_ID,
        privateKey: config.bots.fieldtrip.PRIVATE_KEY,
        clientId: config.bots.fieldtrip.GITHUB_CLIENT_ID,
        clientSecret: config.bots.fieldtrip.GITHUB_CLIENT_SECRET,
      });
      const appAuth = await getAppAuth({ type: "app" });
      const appOctokit = new ProbotOctokit({ auth: appAuth });
      await appOctokit.apps.getUserInstallation({
        username: user.login,
      });
    } catch (err: any) {
      if (err.status !== 404) {
        res.sendStatus(500);
        return;
      }
      const installUrl = `https://github.com/apps/${config.bots.fieldtrip.NAME}/installations/new`;
      res.redirect(installUrl);
      return;
    }

    res.redirect(config.CLIENT_HOST);
  } catch (err: any) {
    next(err);
  }
});

auth.get("/install/:bot", (req, res) => {
  const botName = req.params.bot;
  const botConfig = config.bots[botName as keyof typeof config.bots];

  if (!botConfig) {
    res.sendStatus(404);
    return;
  }

  const installUrl = `https://github.com/apps/${botConfig.NAME}/installations/new`;
  res.redirect(installUrl);
});

auth.get("/install/:bot/cb", async (req, res, next) => {
  const installationId = Number(req.query.installation_id);
  if (!Number.isInteger(installationId)) return;

  const botName = req.params.bot;
  const botConfig = config.bots[botName as keyof typeof config.bots];

  if (!botConfig) {
    res.sendStatus(400);
    return;
  }

  req.session!.bots = {
    ...req.session!.bots,
    [botName]: installationId,
  };

  res.redirect(config.CLIENT_HOST);
});

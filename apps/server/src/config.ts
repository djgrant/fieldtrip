require("dotenv").config({
  path: require("path").resolve(__dirname, "../../../.env"),
});

function getEnv(key: string, required?: true): string;
function getEnv(key: string, required?: false): string | undefined;
function getEnv(key: string, required = true) {
  const value = process.env[key];
  if (required && typeof value !== "string") {
    throw new Error(`Config value for ${key} is not defined`);
  }
  return value;
}

export const DATABASE_URL = getEnv("DATABASE_URL");
export const DATABASE_SCHEMA = getEnv("DATABASE_SCHEMA");
export const SERVER_HOST = getEnv("SERVER_HOST");
export const PORT = getEnv("SERVER_PORT");
export const CLIENT_HOST = getEnv("CLIENT_HOST");
export const ROOT_DOMAIN = getEnv("ROOT_DOMAIN");

export const SESSION_KEY1 = getEnv("SESSION_KEY1");
export const SESSION_KEY2 = getEnv("SESSION_KEY2");

export const GITHUB_AUTH = getEnv("GITHUB_AUTH");

export const isDev = process.env.NODE_ENV === "development";
export const isProd = process.env.NODE_ENV === "production";

export const createBotConfig = (i: number) => ({
  NAME: getEnv(`GH_APP${i}_NAME`),
  APP_ID: getEnv(`GH_APP${i}_ID`),
  GITHUB_CLIENT_ID: getEnv(`GH_APP${i}_CLIENT_ID`),
  GITHUB_CLIENT_SECRET: getEnv(`GH_APP${i}_CLIENT_SECRET`),
  PRIVATE_KEY: getEnv(`GH_APP${i}_PRIVATE_KEY`),
  WEBHOOK_PATH: getEnv(`GH_APP${i}_WEBHOOK_PATH`),
  WEBHOOK_SECRET: getEnv(`GH_APP${i}_WEBHOOK_SECRET`),
  WEBHOOK_PROXY_URL: getEnv(`GH_APP${i}_WEBHOOK_PROXY_URL`, false),
});

export const bots = {
  fieldtrip: createBotConfig(1),
  amber: createBotConfig(2),
  malachi: createBotConfig(3),
  uma: createBotConfig(4),
};

export type BotConfig = ReturnType<typeof createBotConfig>;

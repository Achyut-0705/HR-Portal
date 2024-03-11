import Logger from "../middleware/logger";

export const assignEnvironmentVariable = (key: string) => {
  if (!process.env[key]) {
    Logger.error(`[helper] 🚨 ${key} is not set.`);
    return `[helper] 🚨 ${key} is not set.`;
  } else {
    return process.env[key];
  }
};

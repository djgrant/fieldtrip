import { enrollments, db } from "src/services/db";
import { createBot } from "./bot";

export const fieldtrip = createBot("fieldtrip", (app) => {
  app.on("repository.deleted", async (context) => {
    const username = context.payload.repository?.owner?.login;
    await enrollments(db).delete({ username });
  });
});

export const malachi = createBot("malachi");
export const uma = createBot("uma");
export const amber = createBot("amber");

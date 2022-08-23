import createConnectionPool, { sql } from "@databases/pg";
import tables from "@databases/pg-typed";
import { DATABASE_SCHEMA, DATABASE_URL } from "src/config";
import { emitter } from "src/emitter";
import { DatabaseSchema, Enrollments } from "src/types";
import databaseSchema from "src/types/generated/schema.json";

const db = createConnectionPool({
  bigIntMode: "string",
  connectionString: DATABASE_URL,
  schema: DATABASE_SCHEMA,
  onQueryResults: (_, { text }, results) => {
    if (text.startsWith("SELECT")) return;
    if (!isUpdatedEnrollment(results[0])) return;
    const [result] = results;
    const key = `${result.username}:enrollment:updated`;
    emitter.emit(key, result);
  },
});

const { enrollments, events, tasks } = tables<DatabaseSchema>({
  databaseSchema,
});

export { db, enrollments, events, sql, tasks };

const isUpdatedEnrollment = (result: any): result is Enrollments =>
  typeof result === "object" &&
  result.hasOwnProperty("course_id") &&
  result.hasOwnProperty("username") &&
  result.hasOwnProperty("repo_url") &&
  result.hasOwnProperty("milestones") &&
  result.hasOwnProperty("bots") &&
  result.hasOwnProperty("hooks");

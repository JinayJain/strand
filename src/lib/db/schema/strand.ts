import { relations } from "drizzle-orm";
import {
  AnyPgColumn,
  date,
  integer,
  pgTable,
  serial,
  varchar,
} from "drizzle-orm/pg-core";

import { story } from "./story";

export const strand = pgTable("strand", {
  id: serial("id").primaryKey(),
  parent_id: integer("parent_id").references((): AnyPgColumn => strand.id),
  story_id: varchar("story_id")
    .notNull()
    .references((): AnyPgColumn => story.id),
  content: varchar("content").notNull(),
  created_at: date("created_at").defaultNow(),
});

export type SelectStrand = typeof strand.$inferSelect;
export type InsertStrand = typeof strand.$inferInsert;

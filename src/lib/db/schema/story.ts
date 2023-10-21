import { date, integer, pgTable, varchar } from "drizzle-orm/pg-core";

import { strand } from "./strand";

export const story = pgTable("story", {
  id: varchar("id").primaryKey(),
  title: varchar("title").notNull(),
  root_id: integer("root_id")
    .references(() => strand.id, { onDelete: "set null" })
    .unique(),
  active_date: date("active_date").unique(),
  created_at: date("created_at").defaultNow(),
});

export type SelectStory = typeof story.$inferSelect;
export type InsertStory = typeof story.$inferInsert;

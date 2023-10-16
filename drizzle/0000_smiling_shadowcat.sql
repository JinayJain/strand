CREATE TABLE IF NOT EXISTS "story" (
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"root_id" integer,
	"active_date" date,
	"created_at" date DEFAULT now(),
	CONSTRAINT "story_root_id_unique" UNIQUE("root_id"),
	CONSTRAINT "story_active_date_unique" UNIQUE("active_date")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "strand" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"story_id" varchar NOT NULL,
	"content" varchar NOT NULL,
	"created_at" date DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "story" ADD CONSTRAINT "story_root_id_strand_id_fk" FOREIGN KEY ("root_id") REFERENCES "strand"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "strand" ADD CONSTRAINT "strand_parent_id_strand_id_fk" FOREIGN KEY ("parent_id") REFERENCES "strand"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "strand" ADD CONSTRAINT "strand_story_id_story_id_fk" FOREIGN KEY ("story_id") REFERENCES "story"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "story" DROP CONSTRAINT "story_root_id_strand_id_fk";
--> statement-breakpoint
ALTER TABLE "strand" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "strand" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "story" ADD CONSTRAINT "story_root_id_strand_id_fk" FOREIGN KEY ("root_id") REFERENCES "strand"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

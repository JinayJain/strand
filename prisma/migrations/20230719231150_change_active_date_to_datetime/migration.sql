-- AlterTable
ALTER TABLE "strand_story" ALTER COLUMN "active_date" SET DATA TYPE TIMESTAMP(3);

SET TIME ZONE UTC;

UPDATE "strand_story"
set "active_date" = DATE("active_date")::timestamp without time zone at time zone 'America/New_York';
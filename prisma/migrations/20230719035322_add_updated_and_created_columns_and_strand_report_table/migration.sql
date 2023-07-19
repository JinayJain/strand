/*
  Warnings:

  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- Set values for existing rows
UPDATE "User" SET "updated_at" = "created_at";

-- Set updated_at to NOT NULL
ALTER TABLE "User" ALTER COLUMN "updated_at" SET NOT NULL;


-- CreateTable
CREATE TABLE "strand_report" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "strand_id" TEXT NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "strand_report_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "strand_report" ADD CONSTRAINT "strand_report_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "strand_report" ADD CONSTRAINT "strand_report_strand_id_fkey" FOREIGN KEY ("strand_id") REFERENCES "strand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

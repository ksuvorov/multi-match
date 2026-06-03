DROP INDEX "matches_status_idx";--> statement-breakpoint
ALTER TABLE "matches" DROP COLUMN "status";--> statement-breakpoint
DROP TYPE "public"."match_status";
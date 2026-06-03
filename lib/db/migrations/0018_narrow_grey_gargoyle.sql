ALTER TABLE "matches" ADD COLUMN "listingARejectedAt" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "listingBRejectedAt" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "matches" DROP COLUMN "confirmedAt";
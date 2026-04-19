ALTER TABLE "listings" ADD COLUMN "matchedAt" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "matchingError" text;
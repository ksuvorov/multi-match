DROP INDEX "listings_platform_type_status_idx";--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "role" text NOT NULL;--> statement-breakpoint
CREATE INDEX "listings_platform_role_status_idx" ON "listings" USING btree ("platformId","role","status");--> statement-breakpoint
ALTER TABLE "listings" DROP COLUMN "listingType";--> statement-breakpoint
DROP TYPE "public"."listing_type";
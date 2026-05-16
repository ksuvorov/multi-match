CREATE EXTENSION IF NOT EXISTS postgis;
ALTER TABLE "listings" ADD COLUMN "location" geometry(Point, 4326);--> statement-breakpoint
CREATE INDEX "listings_location_idx" ON "listings" USING gist ("location");--> statement-breakpoint
ALTER TABLE "listings" DROP COLUMN "locationPoint";--> statement-breakpoint
ALTER TABLE "listings" DROP COLUMN "locationLabel";
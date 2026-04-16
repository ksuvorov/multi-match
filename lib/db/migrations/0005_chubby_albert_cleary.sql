CREATE TYPE "public"."match_origin" AS ENUM('auto', 'initiated');--> statement-breakpoint
CREATE TYPE "public"."match_status" AS ENUM('pending', 'confirmed', 'rejected');--> statement-breakpoint
CREATE TABLE "matches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platformId" uuid NOT NULL,
	"offerId" uuid NOT NULL,
	"requestId" uuid NOT NULL,
	"status" "match_status" DEFAULT 'pending' NOT NULL,
	"origin" "match_origin" DEFAULT 'auto' NOT NULL,
	"offerApprovedAt" timestamp with time zone,
	"requestApprovedAt" timestamp with time zone,
	"confirmedAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_platformId_platform_id_fk" FOREIGN KEY ("platformId") REFERENCES "public"."platform"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_offerId_listings_id_fk" FOREIGN KEY ("offerId") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_requestId_listings_id_fk" FOREIGN KEY ("requestId") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "matches_offer_request_unique" ON "matches" USING btree ("offerId","requestId");--> statement-breakpoint
CREATE INDEX "matches_platform_idx" ON "matches" USING btree ("platformId");--> statement-breakpoint
CREATE INDEX "matches_offer_idx" ON "matches" USING btree ("offerId");--> statement-breakpoint
CREATE INDEX "matches_request_idx" ON "matches" USING btree ("requestId");--> statement-breakpoint
CREATE INDEX "matches_status_idx" ON "matches" USING btree ("status");
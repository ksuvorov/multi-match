ALTER TABLE "matches" RENAME COLUMN "offerId" TO "listingAId";--> statement-breakpoint
ALTER TABLE "matches" RENAME COLUMN "requestId" TO "listingBId";--> statement-breakpoint
ALTER TABLE "matches" RENAME COLUMN "offerApprovedAt" TO "listingAApprovedAt";--> statement-breakpoint
ALTER TABLE "matches" RENAME COLUMN "requestApprovedAt" TO "listingBApprovedAt";--> statement-breakpoint
ALTER TABLE "matches" DROP CONSTRAINT "matches_offerId_listings_id_fk";
--> statement-breakpoint
ALTER TABLE "matches" DROP CONSTRAINT "matches_requestId_listings_id_fk";
--> statement-breakpoint
DROP INDEX "matches_offer_request_unique";--> statement-breakpoint
DROP INDEX "matches_offer_idx";--> statement-breakpoint
DROP INDEX "matches_request_idx";--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_listingAId_listings_id_fk" FOREIGN KEY ("listingAId") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_listingBId_listings_id_fk" FOREIGN KEY ("listingBId") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "matches_ab_unique" ON "matches" USING btree ("listingAId","listingBId");--> statement-breakpoint
CREATE INDEX "matches_listingA_idx" ON "matches" USING btree ("listingAId");--> statement-breakpoint
CREATE INDEX "matches_listingB_idx" ON "matches" USING btree ("listingBId");
CREATE TYPE "public"."geo_type" AS ENUM('none', 'point', 'point_radius', 'remote');--> statement-breakpoint
CREATE TYPE "public"."listing_status" AS ENUM('draft', 'active', 'paused', 'closed', 'expired');--> statement-breakpoint
CREATE TYPE "public"."listing_type" AS ENUM('offer', 'request');--> statement-breakpoint
CREATE TYPE "public"."price_type" AS ENUM('fixed', 'hourly', 'daily', 'negotiable');--> statement-breakpoint
CREATE TABLE "platform_schema_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platformId" uuid NOT NULL,
	"version" integer NOT NULL,
	"listingSchemas" jsonb NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"createdBy" uuid
);
--> statement-breakpoint
CREATE TABLE "listings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platformId" uuid NOT NULL,
	"membershipId" uuid NOT NULL,
	"listingType" "listing_type" NOT NULL,
	"status" "listing_status" DEFAULT 'draft' NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"schemaVersion" integer DEFAULT 1 NOT NULL,
	"meta" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"geoType" "geo_type" DEFAULT 'none' NOT NULL,
	"locationPoint" jsonb DEFAULT 'null'::jsonb,
	"searchRadiusKm" integer,
	"locationLabel" text,
	"countryCode" text,
	"priceAmount" numeric(12, 2),
	"priceCurrency" text DEFAULT 'USD',
	"priceType" "price_type",
	"availableFrom" timestamp with time zone,
	"availableUntil" timestamp with time zone,
	"expiresAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "platform" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "platform" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "platform" ADD COLUMN "listingSchemas" jsonb DEFAULT '{"offer":[],"request":[]}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "platform" ADD COLUMN "schemaVersion" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "platform" ADD COLUMN "updatedAt" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "platform_schema_history" ADD CONSTRAINT "platform_schema_history_platformId_platform_id_fk" FOREIGN KEY ("platformId") REFERENCES "public"."platform"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform_schema_history" ADD CONSTRAINT "platform_schema_history_createdBy_platformMembership_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."platformMembership"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_platformId_platform_id_fk" FOREIGN KEY ("platformId") REFERENCES "public"."platform"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_membershipId_platformMembership_id_fk" FOREIGN KEY ("membershipId") REFERENCES "public"."platformMembership"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "listings_platform_idx" ON "listings" USING btree ("platformId");--> statement-breakpoint
CREATE INDEX "listings_membership_idx" ON "listings" USING btree ("membershipId");--> statement-breakpoint
CREATE INDEX "listings_platform_type_status_idx" ON "listings" USING btree ("platformId","listingType","status");--> statement-breakpoint
ALTER TABLE "platform" DROP COLUMN "providerLabel";--> statement-breakpoint
ALTER TABLE "platform" DROP COLUMN "seekerLabel";--> statement-breakpoint
ALTER TABLE "platform" DROP COLUMN "listingSchema";--> statement-breakpoint
ALTER TABLE "platform" DROP COLUMN "requestSchema";
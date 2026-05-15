ALTER TABLE "platform" ALTER COLUMN "config" SET DEFAULT '{"roles":[],"appName":"App"}'::jsonb;--> statement-breakpoint
ALTER TABLE "listings" DROP COLUMN "schemaVersion";--> statement-breakpoint
ALTER TABLE "listings" DROP COLUMN "meta";--> statement-breakpoint
ALTER TABLE "listings" DROP COLUMN "geoType";--> statement-breakpoint
ALTER TABLE "listings" DROP COLUMN "countryCode";--> statement-breakpoint
ALTER TABLE "listings" DROP COLUMN "priceAmount";--> statement-breakpoint
ALTER TABLE "listings" DROP COLUMN "priceCurrency";--> statement-breakpoint
ALTER TABLE "listings" DROP COLUMN "priceType";--> statement-breakpoint
ALTER TABLE "listings" DROP COLUMN "expiresAt";--> statement-breakpoint
DROP TYPE "public"."geo_type";--> statement-breakpoint
DROP TYPE "public"."price_type";
ALTER TABLE "platform" DROP CONSTRAINT "platform_domain_unique";--> statement-breakpoint
ALTER TABLE "platform" DROP COLUMN "domain";--> statement-breakpoint
ALTER TABLE "platform" DROP COLUMN "name";
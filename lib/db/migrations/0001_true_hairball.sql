CREATE TABLE "platformMembership" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platformId" uuid NOT NULL,
	"userId" text NOT NULL,
	"roles" text[] DEFAULT '{}' NOT NULL,
	"joinedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "platformMembership_platformId_userId_unique" UNIQUE("platformId","userId")
);
--> statement-breakpoint
CREATE TABLE "platform" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"domain" text NOT NULL,
	"name" text NOT NULL,
	"providerLabel" text DEFAULT 'Provider' NOT NULL,
	"seekerLabel" text DEFAULT 'Seeker' NOT NULL,
	"listingSchema" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"requestSchema" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "platform_slug_unique" UNIQUE("slug"),
	CONSTRAINT "platform_domain_unique" UNIQUE("domain")
);
--> statement-breakpoint
ALTER TABLE "platformMembership" ADD CONSTRAINT "platformMembership_platformId_platform_id_fk" FOREIGN KEY ("platformId") REFERENCES "public"."platform"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platformMembership" ADD CONSTRAINT "platformMembership_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "platformMembership_platformId_idx" ON "platformMembership" USING btree ("platformId");--> statement-breakpoint
CREATE INDEX "platformMembership_userId_idx" ON "platformMembership" USING btree ("userId");
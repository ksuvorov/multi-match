CREATE TABLE "match_contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"matchId" uuid NOT NULL,
	"membershipId" uuid NOT NULL,
	"contact" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "match_contacts_matchId_membershipId_unique" UNIQUE("matchId","membershipId")
);
--> statement-breakpoint
ALTER TABLE "match_contacts" ADD CONSTRAINT "match_contacts_matchId_matches_id_fk" FOREIGN KEY ("matchId") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_contacts" ADD CONSTRAINT "match_contacts_membershipId_platformMembership_id_fk" FOREIGN KEY ("membershipId") REFERENCES "public"."platformMembership"("id") ON DELETE cascade ON UPDATE no action;
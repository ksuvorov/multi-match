ALTER TABLE "platformMembership" ADD COLUMN "activeRole" text;

UPDATE "platformMembership" SET "activeRole" = "roles"[1];

ALTER TABLE "platformMembership" DROP COLUMN "roles";
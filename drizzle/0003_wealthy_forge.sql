ALTER TABLE "users" ADD COLUMN "verification_token" varchar;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_verification_token_unique" UNIQUE("verification_token");
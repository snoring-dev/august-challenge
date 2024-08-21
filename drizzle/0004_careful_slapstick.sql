ALTER TABLE "users" ADD COLUMN "reset_code" varchar(8);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "reset_code_expires" timestamp;
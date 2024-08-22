CREATE TABLE IF NOT EXISTS "definitions" (
	"id" serial PRIMARY KEY NOT NULL,
	"word_id" integer NOT NULL,
	"definition" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "french_words" (
	"id" serial PRIMARY KEY NOT NULL,
	"word" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "french_words_word_unique" UNIQUE("word")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "definitions" ADD CONSTRAINT "definitions_word_id_french_words_id_fk" FOREIGN KEY ("word_id") REFERENCES "public"."french_words"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

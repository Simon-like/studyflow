-- AlterTable: add tags column to users
ALTER TABLE "users" ADD COLUMN "tags" JSONB;

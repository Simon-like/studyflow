-- AlterTable
ALTER TABLE "users" ADD COLUMN "pin" VARCHAR(20);

-- CreateIndex
CREATE UNIQUE INDEX "users_pin_key" ON "users"("pin");

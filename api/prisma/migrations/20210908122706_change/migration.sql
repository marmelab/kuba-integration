/*
  Warnings:

  - You are about to drop the column `graph` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "graph",
ADD COLUMN     "board" JSONB,
ADD COLUMN     "marbleClicked" JSONB;

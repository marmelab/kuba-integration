/*
  Warnings:

  - You are about to drop the column `hasWinner` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "hasWinner",
ADD COLUMN     "winnerId" INTEGER;

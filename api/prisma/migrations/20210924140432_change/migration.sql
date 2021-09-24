/*
  Warnings:

  - You are about to drop the column `currentPlayer` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "currentPlayer",
ADD COLUMN     "currentPlayerId" INTEGER;

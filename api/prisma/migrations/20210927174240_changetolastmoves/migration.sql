/*
  Warnings:

  - You are about to drop the column `penultimateBoard` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "penultimateBoard",
ADD COLUMN     "lastMoves" JSONB;

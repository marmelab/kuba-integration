/*
  Warnings:

  - You are about to drop the column `lastMove` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "lastMove",
ADD COLUMN     "lastMoveDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

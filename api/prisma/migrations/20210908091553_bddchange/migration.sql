/*
  Warnings:

  - You are about to drop the column `currentPlayer` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `directionSelected` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `graph` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `hasWinner` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `marbleClicked` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `players` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `started` on the `Game` table. All the data in the column will be lost.
  - Added the required column `name` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "currentPlayer",
DROP COLUMN "directionSelected",
DROP COLUMN "graph",
DROP COLUMN "hasWinner",
DROP COLUMN "marbleClicked",
DROP COLUMN "players",
DROP COLUMN "started",
ADD COLUMN     "name" TEXT NOT NULL;

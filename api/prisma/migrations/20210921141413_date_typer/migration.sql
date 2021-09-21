/*
  Warnings:

  - Changed the type of `creationDate` on the `Game` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `lastMoveDate` on the `Game` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "creationDate",
ADD COLUMN     "creationDate" TIMESTAMP(3) NOT NULL,
DROP COLUMN "lastMoveDate",
ADD COLUMN     "lastMoveDate" TIMESTAMP(3) NOT NULL;

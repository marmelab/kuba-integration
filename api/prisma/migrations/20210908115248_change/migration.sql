-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "currentPlayer" INTEGER,
ADD COLUMN     "directionSelected" TEXT,
ADD COLUMN     "hasWinner" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "players" JSONB,
ADD COLUMN     "started" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "graph" JSONB,
    "currentPlayer" JSONB,
    "players" JSONB,
    "marbleClicked" JSONB,
    "directionSelected" TEXT NOT NULL,
    "hasWinner" BOOLEAN NOT NULL,
    "started" BOOLEAN NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

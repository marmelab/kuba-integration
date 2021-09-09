-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "board" JSONB,
    "currentPlayer" INTEGER,
    "players" JSONB,
    "directionSelected" TEXT,
    "marbleClicked" JSONB,
    "hasWinner" BOOLEAN NOT NULL DEFAULT false,
    "started" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

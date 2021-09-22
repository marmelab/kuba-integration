-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "board" JSONB,
    "currentPlayer" INTEGER,
    "players" TEXT,
    "directionSelected" TEXT,
    "marbleClicked" JSONB,
    "hasWinner" BOOLEAN NOT NULL DEFAULT false,
    "started" BOOLEAN NOT NULL DEFAULT false,
    "creationDate" TIMESTAMP(3) NOT NULL,
    "lastMoveDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "username" TEXT NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

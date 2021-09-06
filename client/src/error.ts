export class CantMoveError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CantMoveError";
    console.log(`\u001b[31m${message} \u001b[0m`);
  }
}

export class UserPositionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserPositionError";
    console.log(`\u001b[31m${message} \u001b[0m`);
  }
}
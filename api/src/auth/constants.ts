require('dotenv').config();

export const JWT_CONSTANTS = {
  secret: process.env.JWT_SECRET,
};

export const bcryptSalt = process.env.BCRYPT_SALT;

export const saltRounds = process.env.BCRYPT_SALT_ROUNDS;

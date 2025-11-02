import bcrypt from "bcrypt";

export const hash = async ({ plainText = "", saltRound = +process.env.SALT_ROUND } = {}) => {
  return await bcrypt.hash(plainText, saltRound);
};

export const compare = async ({ plainText = "", hash = "" } = {}) => {
  return await bcrypt.compare(plainText, hash);
};

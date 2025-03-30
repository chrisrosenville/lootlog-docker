import * as bcrypt from "bcrypt";

const saltRounds = 12;

export async function hash(value: string) {
  const result = await bcrypt.hash(value, saltRounds);
  if (result) return result;
  else return null;
}

export async function compare(value: string, hashedValue: string) {
  const isMatching = await bcrypt.compare(value, hashedValue);
  return isMatching;
}

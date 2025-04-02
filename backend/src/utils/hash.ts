import bcrypt from "bcryptjs";

const saltRounds = 12;

export async function hash(value: string) {
  return await bcrypt.hash(value, saltRounds);
}

export async function compare(value: string, hashedValue: string) {
  return await bcrypt.compare(value, hashedValue);
}

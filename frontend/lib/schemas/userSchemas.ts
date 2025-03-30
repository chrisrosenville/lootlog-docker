import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  userName: z.string().min(2).max(50),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  isVerified: z.boolean(),
  isAdmin: z.boolean(),
  isAuthor: z.boolean(),
});

export const signUpSchema = z.object({
  userName: z.string().min(2).max(50),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(50),
  repeatPassword: z.string().min(8).max(50),
});

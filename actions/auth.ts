"use server";

import bcrypt from "bcryptjs";
import { SignupSchema } from "@/lib/schemas/user";
import { createUser, findUserByEmail } from "@/lib/data/users";

export async function signupAction(
  input: unknown,
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = SignupSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Please check your details and try again." };
  }

  const existing = await findUserByEmail(parsed.data.email);
  if (existing) {
    return { success: false, error: "An account with that email already exists." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  await createUser({
    email: parsed.data.email,
    passwordHash,
    name: parsed.data.name,
  });

  return { success: true };
}

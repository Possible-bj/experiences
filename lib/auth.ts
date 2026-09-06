import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "@/lib/data/users";
import { LoginSchema } from "@/lib/schemas/user";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const parsed = LoginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await findUserByEmail(parsed.data.email);
        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash,
        );
        if (!passwordsMatch) return null;

        return { id: user._id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) token.userId = user.id;
      return token;
    },
    session: ({ session, token }) => {
      if (session.user) session.user.id = token.userId as string;
      return session;
    },
  },
});

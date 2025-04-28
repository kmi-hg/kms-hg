// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabaseClient";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        nrp: { label: "NRP", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { data, error } = await supabase
          .from("user_table")
          .select("*")
          .eq("nrp", credentials?.nrp)
          .single();

        if (error || !data) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials?.password || "",
          data.password
        );

        if (!isPasswordValid) {
          return null;
        }

        const user = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
        };

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.role = token.role;
      return session;
    },
  },
};

export default NextAuth(authOptions);

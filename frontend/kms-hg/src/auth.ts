import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabaseClient";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      nrp: string;
      role: string;
      id: string;
    };
  }

  interface User {
    nrp: string;
    role: string;
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    nrp: string;
    role: string;
    id: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        nrp: {
          type: "text",
          label: "NRP",
        },
        password: {
          type: "password",
          label: "Password",
        },
      },
      authorize: async (credentials) => {
        console.log("Credentials received:", credentials);

        const { data, error } = await supabase
          .from("users_table")
          .select("*")
          .eq("nrp", credentials.nrp)
          .single();

        console.log("Supabase data:", data, "Error:", error);

        if (error || !data) {
          console.log("Error or no data found:", error);
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          data.password as string
        );

        if (!isPasswordValid) {
          console.log("Invalid password for user:", credentials.nrp);
          return null;
        }

        return data;
      },
    }),
  ],
  
  pages: {
    signIn: "/login",
  },
  
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
    jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.nrp = user.nrp;
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.name = token.name;
      session.user.nrp = token.nrp;
      session.user.role = token.role;
      session.user.id = token.id;
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 15 * 60,
  },
});

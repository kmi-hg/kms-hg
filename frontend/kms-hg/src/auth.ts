import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabaseClient";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      nrp: string;
      role: string;
      id: string; // Adding the `id` field of type string (UUID)
    };
  }

  interface User {
    nrp: string;
    role: string;
    id: string; // Adding the `id` field of type string (UUID)
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    nrp: string;
    role: string;
    id: string; // Adding the `id` field of type string (UUID)
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
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.name = user.name;
        token.nrp = user.nrp;
        token.role = user.role;
        token.id = user.id; // Add user id (UUID) to the token
      }
      return token;
    },
    session({ session, token }) {
      session.user.name = token.name;
      session.user.nrp = token.nrp;
      session.user.role = token.role;
      session.user.id = token.id; // Assign the user id (UUID) from token to session
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 15 * 60,
  },
});

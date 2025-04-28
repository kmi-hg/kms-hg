import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabaseClient";

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
          .from("user_table")
          .select("*")
          .eq("nrp", credentials.nrp)
          .single();

        if (error || !data) {
          console.log("Error or no data found:", error);
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          data.password
        );

        if (!isPasswordValid) {
          console.log("Invalid password for user:", credentials.nrp);
          return null;
        }

        const user = {
          id: data.id,
          name: data.name,
          nrp: data.nrp,
          role: data.role,
        };

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
});

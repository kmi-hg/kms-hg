// app/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { nrp, password } = req.body;

    const { data, error } = await supabase
      .from("user_table")
      .select("*")
      .eq("nrp", nrp)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, data.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
    };

    return res.status(200).json({ user });
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}

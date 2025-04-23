// app/api/expert/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { db } from "../db";
import { smeTable, sbuEnum } from "@/db/schema/expert";
import { eq } from "drizzle-orm";

// Define SBU enum list for validation
const SBU_VALUES = [
  "Logistic",
  "Argo Forestry",
  "Energy",
  "Technology & Services",
  "Education",
  "Consumer",
  "Investment",
] as const;

type SBUType = (typeof SBU_VALUES)[number];

export async function GET() {
  try {
    const smeData = await db.select().from(smeTable);
    return NextResponse.json(smeData);
  } catch (error) {
    console.error("Error fetching SME data:", error);
    return NextResponse.json({ error: "Failed to fetch SME data." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("profile_picture") as File;
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const sbu = formData.get("sbu")?.toString().trim();
    const bio = formData.get("bio")?.toString().trim();
    const area_of_expertise = formData.get("area_of_expertise")?.toString().trim();

    // Validation
    if (!file || !name || !email || !sbu || !bio || !area_of_expertise) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
    }

    if (!SBU_VALUES.includes(sbu as SBUType)) {
      return NextResponse.json({ error: "Invalid SBU value." }, { status: 400 });
    }

    // Upload image to Supabase Storage
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const bucket = "sme-profile";

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        contentType: file.type,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
    const profile_url = publicUrlData?.publicUrl;

    // Insert into database
    await db.insert(smeTable).values({
      name,
      email,
      sbu: sbu as SBUType,
      bio,
      area_of_expertise,
      profile_url,
    });

    return NextResponse.json({ message: "SME uploaded successfully." });

  } catch (error) {
    console.error("Error in POST /api/expert:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

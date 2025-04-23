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

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    await db.delete(smeTable).where(eq(smeTable.id, Number(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SME delete error:", error);
    return NextResponse.json({ error: "Failed to delete SME" }, { status: 500 });
  }
}

// app/api/expert/route.ts
// Union types (match exactly what's in your schema)
type SBU =
  | "Logistic"
  | "Argo Forestry"
  | "Energy"
  | "Technology & Services"
  | "Education"
  | "Consumer"
  | "Investment";

type AreaOfExpertise =
  | "Logistic"
  | "Argo Forestry"
  | "Energy"
  | "Technology & Services"
  | "Education"
  | "Consumer"
  | "Investment";

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();

    const id = Number(formData.get("id"));
    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();
    const sbuRaw = formData.get("sbu")?.toString();
    const bio = formData.get("bio")?.toString();
    const areaRaw = formData.get("area_of_expertise")?.toString();

    if (!id || !name || !email || !sbuRaw || !bio || !areaRaw) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Validate SBU and Area of Expertise
    const allowedValues: SBU[] = [
      "Logistic",
      "Argo Forestry",
      "Energy",
      "Technology & Services",
      "Education",
      "Consumer",
      "Investment",
    ];

    if (!allowedValues.includes(sbuRaw as SBU)) {
      return NextResponse.json({ error: "Invalid SBU value." }, { status: 400 });
    }

    if (!allowedValues.includes(areaRaw as AreaOfExpertise)) {
      return NextResponse.json({ error: "Invalid Area of Expertise." }, { status: 400 });
    }

    const sbu = sbuRaw as SBU;
    const area_of_expertise = areaRaw as AreaOfExpertise;

    await db
      .update(smeTable)
      .set({
        name,
        email,
        sbu,
        bio,
        area_of_expertise,
      })
      .where(eq(smeTable.id, id));

    return NextResponse.json({ message: "SME updated successfully." });
  } catch (error) {
    console.error("SME update error:", error);
    return NextResponse.json({ error: "Failed to update SME." }, { status: 500 });
  }
}



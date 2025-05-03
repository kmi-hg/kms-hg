// app/api/expert/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { db } from "../db";
import { smeTable } from "@/db/schema/expert";
import { eq } from "drizzle-orm";
import {
  CoreCompetencyEnum,
  DepartmentEnum,
  EntitasEnum,
  ExpertiseEnum,
  expertTable,
} from "@/db/schema/sme";

export async function GET() {
  try {
    // Fetch data from expert_table
    const smeData = await db.select().from(expertTable);

    return NextResponse.json(smeData);
  } catch (error) {
    console.error("Error fetching SME data:", error);
    return NextResponse.json(
      { error: "Failed to fetch SME data." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    console.log("📥 Incoming SME POST request");

    const formData = await req.formData();
    const DEFAULT_PROFILE_URL = "/default-profile-picture.png";

    const file = formData.get("profile_picture") as File | null;
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const department = formData.get("department")?.toString().trim();
    const position = formData.get("position")?.toString().trim();
    const entitas = formData.get("entitas")?.toString().trim();
    const expertise = formData.get("expertise")?.toString().trim();
    const bio = formData.get("bio")?.toString().trim();
    const currentProfileUrl = formData.get("current_profile_url")?.toString();
    const coreCompetency = formData
      .getAll("core_competency[]")
      .map((val) => val.toString().trim());

    console.log("🧾 Parsed form data:", {
      name,
      email,
      department,
      position,
      entitas,
      expertise,
      bio,
      coreCompetency,
      currentProfileUrl,
      hasFile: !!file,
    });

    // Validate required fields
    if (
      !name ||
      !email ||
      !department ||
      !position ||
      !entitas ||
      !expertise ||
      !bio ||
      coreCompetency.length === 0
    ) {
      console.warn("⚠️ Missing required fields.");
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Collect invalid values
    const invalidEnums: Record<string, any[]> = {
      department: [],
      entitas: [],
      expertise: [],
      coreCompetency: [],
    };

    // Validate enums and log invalids
    if (!DepartmentEnum.enumValues.includes(department as any)) {
      invalidEnums.department.push(department);
    }

    if (!EntitasEnum.enumValues.includes(entitas as any)) {
      invalidEnums.entitas.push(entitas);
    }

    if (!ExpertiseEnum.enumValues.includes(expertise as any)) {
      invalidEnums.expertise.push(expertise);
    }

    const invalidCoreCompetencies = coreCompetency.filter(
      (val) => !CoreCompetencyEnum.enumValues.includes(val as any)
    );
    if (invalidCoreCompetencies.length > 0) {
      invalidEnums.coreCompetency.push(...invalidCoreCompetencies);
    }

    // If any invalid values exist, log and return error
    const hasInvalid = Object.values(invalidEnums).some(
      (arr) => arr.length > 0
    );

    if (hasInvalid) {
      console.warn("⚠️ Invalid enum value(s) detected:", invalidEnums);
      return NextResponse.json(
        { error: "Invalid enum values.", details: invalidEnums },
        { status: 400 }
      );
    }

    // Supabase setup
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    let profile_url = DEFAULT_PROFILE_URL;

    // Upload image if present
    if (file) {
      console.log("📷 Uploading profile image...");
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        console.warn("❌ Uploaded file is not an image.");
        return NextResponse.json(
          { error: "Only image files are allowed." },
          { status: 400 }
        );
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const bucket = "sme-profile";

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { contentType: file.type });

      if (uploadError) {
        console.error("❌ Supabase upload error:", uploadError.message);
        return NextResponse.json(
          { error: uploadError.message },
          { status: 500 }
        );
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      profile_url = publicUrlData?.publicUrl || DEFAULT_PROFILE_URL;
      console.log("✅ Image uploaded. Public URL:", profile_url);
    } else if (currentProfileUrl) {
      profile_url = currentProfileUrl;
      console.log("ℹ️ Using existing profile URL.");
    }

    // Construct payload for insert
    const insertPayload = {
      name,
      email,
      department: department as (typeof DepartmentEnum.enumValues)[number],
      position,
      entitas: entitas as (typeof EntitasEnum.enumValues)[number],
      expertise: expertise as (typeof ExpertiseEnum.enumValues)[number],
      core_competency:
        coreCompetency as (typeof CoreCompetencyEnum.enumValues)[number][],
      bio,
      profile_url,
    };

    console.log("📤 Inserting into database:", insertPayload);

    await db.insert(expertTable).values(insertPayload);

    console.log("✅ SME inserted successfully.");
    return NextResponse.json({ message: "SME uploaded successfully." });
  } catch (error) {
    console.error("❌ Error in POST /api/expert:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    await db.delete(expertTable).where(eq(expertTable.id, Number(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SME delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete SME" },
      { status: 500 }
    );
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
      const DEFAULT_PROFILE_URL = "/default-profile-picture.png";
  
      const id = Number(formData.get("id"));
      const name = formData.get("name")?.toString().trim();
      const email = formData.get("email")?.toString().trim();
      const department = formData.get("department")?.toString().trim();
      const position = formData.get("position")?.toString().trim();
      const entitas = formData.get("entitas")?.toString().trim();
      const expertise = formData.get("expertise")?.toString().trim();
      const bio = formData.get("bio")?.toString().trim();
      const coreCompetency = formData
        .getAll("core_competency[]")
        .map((val) => val.toString().trim());
  
      const currentProfileUrl = formData.get("current_profile_url")?.toString();
      const file = formData.get("profile_picture") as File | null;
  
      if (
        !id ||
        !name ||
        !email ||
        !department ||
        !position ||
        !entitas ||
        !expertise ||
        !bio ||
        coreCompetency.length === 0
      ) {
        return NextResponse.json(
          { error: "Missing required fields." },
          { status: 400 }
        );
      }
  
      // Validate enums
      if (!DepartmentEnum.enumValues.includes(department as any)) {
        return NextResponse.json({ error: "Invalid department" }, { status: 400 });
      }
  
      if (!EntitasEnum.enumValues.includes(entitas as any)) {
        return NextResponse.json({ error: "Invalid entitas" }, { status: 400 });
      }
  
      if (!ExpertiseEnum.enumValues.includes(expertise as any)) {
        return NextResponse.json({ error: "Invalid expertise" }, { status: 400 });
      }
  
      const invalidCore = coreCompetency.filter(
        (val) => !CoreCompetencyEnum.enumValues.includes(val as any)
      );
      if (invalidCore.length > 0) {
        return NextResponse.json(
          { error: "Invalid core competency", details: invalidCore },
          { status: 400 }
        );
      }
  
      let profile_url = currentProfileUrl || DEFAULT_PROFILE_URL;
  
      if (file) {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
  
        const fileExt = file.name.split(".").pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const bucket = "sme-profile";
  
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(fileName, file, { contentType: file.type });
  
        if (uploadError) {
          return NextResponse.json(
            { error: uploadError.message },
            { status: 500 }
          );
        }
  
        const { data: publicUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName);
        profile_url = publicUrlData?.publicUrl || DEFAULT_PROFILE_URL;
      }
  
      await db
        .update(expertTable)
        .set({
          name,
          email,
          department: department as (typeof DepartmentEnum.enumValues)[number],
          position,
          entitas: entitas as (typeof EntitasEnum.enumValues)[number],
          expertise: expertise as (typeof ExpertiseEnum.enumValues)[number],
          core_competency:
            coreCompetency as (typeof CoreCompetencyEnum.enumValues)[number][],
          bio,
          profile_url,
        })
        .where(eq(expertTable.id, id));
  
      return NextResponse.json({ message: "SME updated successfully." });
    } catch (error) {
      console.error("❌ SME update error:", error);
      return NextResponse.json(
        { error: "Failed to update SME." },
        { status: 500 }
      );
    }
  }
  
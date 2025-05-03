import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { db } from "../db";
import { eq } from "drizzle-orm";
import {
  CoreCompetencyEnum,
  DepartmentEnum,
  EntitasEnum,
  ExpertiseEnum,
  expertTable,
} from "@/db/schema/sme";

type InvalidEnums = {
  department: string[];
  entitas: string[];
  expertise: string[];
  coreCompetency: string[];
};

export async function GET() {
  try {
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
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const invalidEnums: InvalidEnums = {
      department: [],
      entitas: [],
      expertise: [],
      coreCompetency: [],
    };

    if (
      !DepartmentEnum.enumValues.includes(
        department as (typeof DepartmentEnum.enumValues)[number]
      )
    ) {
      invalidEnums.department.push(department);
    }

    if (
      !EntitasEnum.enumValues.includes(
        entitas as (typeof EntitasEnum.enumValues)[number]
      )
    ) {
      invalidEnums.entitas.push(entitas);
    }

    if (
      !ExpertiseEnum.enumValues.includes(
        expertise as (typeof ExpertiseEnum.enumValues)[number]
      )
    ) {
      invalidEnums.expertise.push(expertise);
    }

    const invalidCoreCompetencies = coreCompetency.filter(
      (val) =>
        !CoreCompetencyEnum.enumValues.includes(
          val as (typeof CoreCompetencyEnum.enumValues)[number]
        )
    );
    if (invalidCoreCompetencies.length > 0) {
      invalidEnums.coreCompetency.push(...invalidCoreCompetencies);
    }

    const hasInvalid = Object.values(invalidEnums).some(
      (arr) => arr.length > 0
    );
    if (hasInvalid) {
      return NextResponse.json(
        { error: "Invalid enum values.", details: invalidEnums },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    let profile_url = DEFAULT_PROFILE_URL;

    if (file) {
      if (!file.type.startsWith("image/")) {
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
        return NextResponse.json(
          { error: uploadError.message },
          { status: 500 }
        );
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);
      profile_url = publicUrlData?.publicUrl || DEFAULT_PROFILE_URL;
    } else if (currentProfileUrl) {
      profile_url = currentProfileUrl;
    }

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

    await db.insert(expertTable).values(insertPayload);

    return NextResponse.json({ message: "SME uploaded successfully." });
  } catch (error) {
    console.error("Error in POST /api/expert:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id }: { id: number } = await req.json();

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

    if (
      !DepartmentEnum.enumValues.includes(
        department as (typeof DepartmentEnum.enumValues)[number]
      )
    ) {
      return NextResponse.json(
        { error: "Invalid department" },
        { status: 400 }
      );
    }

    if (
      !EntitasEnum.enumValues.includes(
        entitas as (typeof EntitasEnum.enumValues)[number]
      )
    ) {
      return NextResponse.json({ error: "Invalid entitas" }, { status: 400 });
    }

    if (
      !ExpertiseEnum.enumValues.includes(
        expertise as (typeof ExpertiseEnum.enumValues)[number]
      )
    ) {
      return NextResponse.json({ error: "Invalid expertise" }, { status: 400 });
    }

    const invalidCore = coreCompetency.filter(
      (val) =>
        !CoreCompetencyEnum.enumValues.includes(
          val as (typeof CoreCompetencyEnum.enumValues)[number]
        )
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
    console.error("SME update error:", error);
    return NextResponse.json(
      { error: "Failed to update SME." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { knowledgeTable } from "@/db/schema/knowledge";
import { db } from "../db";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

type FieldEnum =
  | "Corsec/Corplan"
  | "Operation"
  | "HCGS"
  | "Procurement"
  | "Others"
  | "Fleet Mgt"
  | "FAT"
  | "GRCD"
  | "Legal & permit"
  | "Marketing & Sales";

const allowedFields: FieldEnum[] = [
  "Corsec/Corplan",
  "Operation",
  "HCGS",
  "Procurement",
  "Others",
  "Fleet Mgt",
  "FAT",
  "GRCD",
  "Legal & permit",
  "Marketing & Sales",
];

export async function GET() {
  try {
    const knowledge = await db.select().from(knowledgeTable);
    return NextResponse.json(knowledge);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Database failed." }, { status: 500 });
  }
  
}

export async function POST(req: Request) {
  const formData = await req.formData();

  const file = formData.get("file") as File;
  const name = formData.get("name")?.toString().trim();
  const field = formData.get("field")?.toString().trim();
  const tags = formData.get("tags")?.toString().trim();

  if ( !name || !field || !tags) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  if (!allowedFields.includes(field as FieldEnum)) {
    return NextResponse.json({ error: "Invalid field value." }, { status: 400 });
  }

  const isPDF = file.type === "application/pdf";
  const isMP3 = file.type === "audio/mpeg";

  if (!isPDF && !isMP3) {
    return NextResponse.json({ error: "Only PDF or MP3 allowed." }, { status: 400 });
  }

  const bucket = isPDF ? "knowledge-pdf" : "knowledge-mp3";
  const ext = isPDF ? "pdf" : "mp3";
  const fileName = `${uuidv4()}.${ext}`;
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      contentType: file.type,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
  const publicUrl = publicUrlData?.publicUrl;
  const fileSizeMB = file.size / 1024 / 1024;

  await db.insert(knowledgeTable).values({
    name,
    field: field as FieldEnum,
    tags,
    type: ext,
    path: publicUrl,
    size: parseFloat(fileSizeMB.toFixed(2)),
  });

  return NextResponse.json({ message: "Upload successful." });
}

export async function PUT(req: Request) {
  const formData = await req.formData();
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim();
  const field = formData.get("field")?.toString().trim();
  const tags = formData.get("tags")?.toString().trim();
  const type = formData.get("type") as "pdf" | "mp3";
  const oldPath = formData.get("oldPath")?.toString();
  const file = formData.get("file") as File | null;

  if (!id || !name || !field || !tags || !type || !oldPath) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  if (!allowedFields.includes(field as FieldEnum)) {
    return NextResponse.json({ error: "Invalid field." }, { status: 400 });
  }

  let path = oldPath;
  let size;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  if (file) {
    const bucket = type === "pdf" ? "knowledge-pdf" : "knowledge-audio";
    const oldFileName = oldPath.split("/").pop();

    await supabase.storage.from(bucket).remove([oldFileName!]);

    const newFileName = `${uuidv4()}.${type}`;
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(newFileName, file, {
        contentType: file.type,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(newFileName);
    path = publicUrlData?.publicUrl!;
    size = parseFloat((file.size / 1024 / 1024).toFixed(2));
  }

  await db
    .update(knowledgeTable)
    .set({
      name,
      field: field as FieldEnum,
      tags,
      path,
      ...(size && { size }),
    })
    .where(eq(knowledgeTable.id, Number(id)));

  return NextResponse.json({ message: "Update successful." });
}

export async function DELETE(req: Request) {
  const { id, path, type } = await req.json();

  if (!id || !path || !type) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  const bucket = type === "pdf" ? "knowledge-pdf" : "knowledge-audio";
  const fileName = path.split("/").pop();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  await supabase.storage.from(bucket).remove([fileName!]);
  await db.delete(knowledgeTable).where(eq(knowledgeTable.id, Number(id)));

  return NextResponse.json({ message: "Deleted successfully." });
}

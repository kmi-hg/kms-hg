import { NextResponse } from "next/server";
import { knowledgeTable } from "@/db/schema/knowledge";
import { db } from "./db";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const BUCKET_NAME = "knowledge-pdf";

// Match your enum type
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

export async function GET() {
  const knowledge = await db.select().from(knowledgeTable);
  return NextResponse.json(knowledge);
}

export async function POST(req: Request) {
  const formData = await req.formData();

  const rawFile = formData.get("file");
  const name = formData.get("name")?.toString().trim();
  const field = formData.get("field")?.toString().trim();
  const tags = formData.get("tags")?.toString().trim();

  if (
    !rawFile ||
    typeof rawFile !== "object" ||
    !(rawFile instanceof Blob) ||
    !name ||
    !field ||
    !tags
  ) {
    return NextResponse.json(
      { error: "All fields and a file are required." },
      { status: 400 }
    );
  }

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

  if (!allowedFields.includes(field as FieldEnum)) {
    return NextResponse.json({ error: "Invalid field value." }, { status: 400 });
  }

  const file = rawFile as File;

  const isPDF = file.type === "application/pdf";
  const isMP3 = file.type === "audio/mpeg";

  if (!isPDF && !isMP3) {
    return NextResponse.json(
      { error: "Only PDF or MP3 files are allowed." },
      { status: 400 }
    );
  }

  const fileExt = isPDF ? "pdf" : "mp3";
  const bucket = isPDF ? "knowledge-pdf" : "knowledge-mp3";
  const contentType = isPDF ? "application/pdf" : "audio/mpeg";

  const fileName = `${uuidv4()}.${fileExt}`;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      contentType,
    });

  if (uploadError) {
    console.error("Upload error:", uploadError.message);
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  const publicUrl = publicUrlData?.publicUrl;
  if (!publicUrl) {
    return NextResponse.json(
      { error: "Failed to generate public URL." },
      { status: 500 }
    );
  }

  const fileSizeMB = file.size / 1024 / 1024;

  await db.insert(knowledgeTable).values({
    name,
    field: field as FieldEnum,
    tags,
    type: fileExt as "pdf" | "mp3",
    path: publicUrl,
    size: parseFloat(fileSizeMB.toFixed(2)),
  });

  return NextResponse.json({ message: "Upload successful." });
}

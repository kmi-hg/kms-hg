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

  // Periksa apakah file dan field yang diperlukan ada
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({ error: "File is required." }, { status: 400 });
  }

  const thumbnail = formData.get("thumbnail") as File | null;
  const name = formData.get("name")?.toString().trim();
  const field = formData.get("field")?.toString().trim();
  const tags = formData.get("tags")?.toString().trim();

  // Periksa apakah field lain ada dan valid
  if (!name || !field || !tags) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  // Validasi field
  if (!allowedFields.includes(field as FieldEnum)) {
    return NextResponse.json(
      { error: "Invalid field value." },
      { status: 400 }
    );
  }

  const isPDF = file.type === "application/pdf";
  const isMP3 = file.type === "audio/mpeg";

  // Validasi tipe file
  if (!isPDF && !isMP3) {
    return NextResponse.json(
      { error: "Only PDF or MP3 allowed." },
      { status: 400 }
    );
  }

  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Tentukan bucket berdasarkan tipe file
  const bucket = isPDF ? "knowledge-pdf" : "knowledge-mp3";
  const ext = isPDF ? "pdf" : "mp3";
  const fileName = `${uuidv4()}.${ext}`;

  // Upload file utama ke Supabase
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { contentType: file.type });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: fileUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);
  const fileUrl = fileUrlData?.publicUrl; // Pastikan `fileUrl` ada

  if (!fileUrl) {
    return NextResponse.json(
      { error: "File URL is missing." },
      { status: 500 }
    );
  }

  const fileSizeMB = file.size / 1024 / 1024;

  // Upload thumbnail jika file adalah MP3 dan thumbnail ada
  let thumbnailUrl: string | undefined = undefined;

  if (isMP3 && thumbnail) {
    const thumbName = `${uuidv4()}-${thumbnail.name}`;
    const { error: thumbError } = await supabase.storage
      .from("knowledge-thumbnails")
      .upload(thumbName, thumbnail, { contentType: thumbnail.type });

    if (thumbError) {
      return NextResponse.json({ error: thumbError.message }, { status: 500 });
    }

    const { data: thumbUrlData } = supabase.storage
      .from("knowledge-thumbnails")
      .getPublicUrl(thumbName);
    thumbnailUrl = thumbUrlData?.publicUrl;
  }

  // Masukkan data ke database
  await db.insert(knowledgeTable).values({
    name,
    field: field as FieldEnum,
    tags,
    type: ext,
    path: fileUrl,
    size: parseFloat(fileSizeMB.toFixed(2)),
    thumbnailPath: thumbnailUrl,
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
  const thumbnail = formData.get("thumbnail") as File | null;

  // Validasi input
  if (!id || !name || !field || !tags || !type || !oldPath) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  if (!allowedFields.includes(field as FieldEnum)) {
    return NextResponse.json({ error: "Invalid field." }, { status: 400 });
  }

  let path = oldPath;
  let size: number | undefined;
  let thumbnailPath: string | undefined;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Periksa jika file baru diupload
  if (file) {
    const bucket = type === "pdf" ? "knowledge-pdf" : "knowledge-audio";
    const oldFileName = oldPath.split("/").pop();

    // Hapus file lama dari Supabase
    await supabase.storage.from(bucket).remove([oldFileName!]);

    const newFileName = `${uuidv4()}.${type}`;
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(newFileName, file, { contentType: file.type });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(newFileName);
    path = publicUrlData?.publicUrl;

    if (!path) {
      return NextResponse.json(
        { error: "Failed to retrieve file URL." },
        { status: 500 }
      );
    }

    size = parseFloat((file.size / 1024 / 1024).toFixed(2));
  }

  // Periksa jika thumbnail baru diunggah untuk MP3
  if (type === "mp3" && thumbnail) {
    const thumbName = `${uuidv4()}-${thumbnail.name}`;
    const { error: thumbError } = await supabase.storage
      .from("knowledge-thumbnails")
      .upload(thumbName, thumbnail, { contentType: thumbnail.type });

    if (thumbError) {
      return NextResponse.json({ error: thumbError.message }, { status: 500 });
    }

    const { data: thumbUrlData } = supabase.storage
      .from("knowledge-thumbnails")
      .getPublicUrl(thumbName);
    thumbnailPath = thumbUrlData?.publicUrl;
  }

  // Update database record
  await db
    .update(knowledgeTable)
    .set({
      name,
      field: field as FieldEnum,
      tags,
      path,
      ...(size && { size }),
      ...(thumbnailPath && { thumbnailPath }),
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

  if (!fileName) {
    return NextResponse.json({ error: "Invalid file path." }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Hapus file dari Supabase
  await supabase.storage.from(bucket).remove([fileName]);
  await db.delete(knowledgeTable).where(eq(knowledgeTable.id, Number(id)));

  return NextResponse.json({ message: "Deleted successfully." });
}

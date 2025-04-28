import KnowledgeClient from "./_components/KnowledgeClient";
import { auth } from "@/auth";

export default async function KnowledgePage() {
  const session = await auth();

  if (!session || !session.user) {
    console.error("Session tidak ditemukan");
    return <div>Error: Tidak dapat memuat data pengguna.</div>;
  }

  const role = session.user.role || "Karyawan";
  console.log("User role:", role);

  return <KnowledgeClient role={role} />;
}

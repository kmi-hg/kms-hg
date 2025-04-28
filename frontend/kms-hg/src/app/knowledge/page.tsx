import KnowledgeClient from "./_components/KnowledgeClient";
import { auth } from "@/auth";

export default async function KnowledgePage() {
  const session = await auth();
  
  const role = session?.user.role || "Karyawan";

  console.log("User role:", session);
  
  return <KnowledgeClient role={role} />;
}

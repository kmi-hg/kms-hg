import KnowledgeClient from "./_components/KnowledgeClient";

export default async function KnowledgePage() {
  // const { userId } = await auth();
  // console.log("userId:", userId);
  // if (!userId) redirect("/");

  // const user = await currentUser();
  // const role = (user?.publicMetadata?.role as string) || "";
  const role = "KMI";
  return <KnowledgeClient role={role} />;
}

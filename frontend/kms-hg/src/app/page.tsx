// pages/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; 

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session) {
      router.push("/login");
    } else {
      router.push("/knowledge");
    }
  }, [session, status, router]);

  return (
    <div>
      <p>Loading...</p>
    </div>
  );
}

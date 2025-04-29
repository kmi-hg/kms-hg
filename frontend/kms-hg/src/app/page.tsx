// pages/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; 

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If session is loading, do nothing (just wait)
    if (status === "loading") {
      return;
    }

    // If no session exists, redirect to login page
    if (!session) {
      router.push("/login");
    } else {
      // If session exists, redirect to knowledge page
      router.push("/knowledge");
    }
  }, [session, status, router]);

  return (
    <div>
      <p>Loading...</p>
    </div>
  );
}

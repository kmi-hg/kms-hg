// SMEClientWrapper.tsx
"use client";

import { useSearchParams } from "next/navigation";
import SMEClient from "./SMEClient";

export default function SMEClientWrapper() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  return <SMEClient role={role ?? ""} />;
}

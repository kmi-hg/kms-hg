// app/subject-matter-expert/page.tsx
import Breadcrumb from "../../components/sme-page/Breadcrumb";
import BreadcrumbItem from "../../components/sme-page/BreadcrumbItem";
import SMEClientWrapper from "./_components/SMEClientWrapper";
import { Suspense } from "react";

export const dynamic = "force-dynamic"; // Optional: if you want dynamic rendering

export default function SMEPage() {
  return (
    <div className="pt-[60px] px-[80px] ">
      <h1 className="text-black font-medium text-[24px] mb-2">
        Subject Matter Expert
      </h1>
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/subject-matter-expert">
          Subject Matter Expert
        </BreadcrumbItem>
      </Breadcrumb>
      <br />
      <Suspense fallback={<div>Loading SME content...</div>}>
        <SMEClientWrapper />
      </Suspense>
    </div>
  );
}

// app/subject-matter-expert/page.tsx
import SMEClient from "./_components/SMEClient";
import Breadcrumb from "../../components/sme-page/Breadcrumb";
import BreadcrumbItem from "../../components/sme-page/BreadcrumbItem";
import SearchBar from "../../components/sme-page/SearchBar";

export default function SMEPage() {
  return (
    <div className="pt-[60px] px-4">
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
      <SearchBar />
      <br />
      <SMEClient />
    </div>
  );
}

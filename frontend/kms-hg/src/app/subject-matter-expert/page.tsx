import SMECard from "../components/cards/SMECard";
import Breadcrumb from "../components/layout/breadcrumb";
import BreadcrumbItem from "../components/layout/breadcrumbitem";
import SearchBar from "../components/ui/SearchBar";

export default function SMEPage() {
  // const dummyData = Array(20).fill({
  //   name: "Teuku Fajar Akbar",
  //   email: "teuku.fajar@hasnurgroup.com",
  // });

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

      {/* Search Bar */}
      <SearchBar />

      <br />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[17px]">
        {[...Array(12)].map((_, index) => (
          <SMECard key={index} />
        ))}
      </div>
    </div>
  );
}

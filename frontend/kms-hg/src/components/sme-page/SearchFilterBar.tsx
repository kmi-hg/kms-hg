import { FaCaretDown } from "react-icons/fa";
import Image from "next/image";

interface SearchFilterBarProps {
  selectedAreaOfExpertise: string;
  setSelectedAreaOfExpertise: (value: string) => void;
  isOpenAreaOfExpertise: boolean;
  setIsOpenAreaOfExpertise: (value: boolean) => void;

  selectedSBU: string; // now used for Core Competency
  setSelectedSBU: (value: string) => void;
  isOpenSBU: boolean;
  setIsOpenSBU: (value: boolean) => void;

  AreaOfExpertiseOptions: string[];
  CoreCompetencyOptions: string[]; // ✅ ADD this to props

  viewMode: "grid" | "list";
  setViewMode: (value: "grid" | "list") => void;
  isOverview: boolean;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export default function SearchFilterBar({
  selectedAreaOfExpertise,
  setSelectedAreaOfExpertise,
  isOpenAreaOfExpertise,
  setIsOpenAreaOfExpertise,

  selectedSBU, // used as selectedCoreCompetency
  setSelectedSBU,
  isOpenSBU,
  setIsOpenSBU,

  AreaOfExpertiseOptions,
  CoreCompetencyOptions,

  viewMode,
  setViewMode,
  isOverview,
  searchQuery,
  setSearchQuery,
}: SearchFilterBarProps) {
  return (
    <div className="w-full h-[70px] border border-[#c2c2c2] rounded-[12px] px-[23.5px] py-[14px] flex gap-[13px] justify-center items-center mb-[20px]">
      {/* Search Input */}
      <div className="w-full h-full rounded-[12px] px-[18px] py-[9px] flex items-center bg-white border border-[#c2c2c2]">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search SME..."
          className="w-full text-sm text-[#6A6969] outline-none border-none"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-[12px]">
        {/* Area of Expertise Filter */}
        <div className="relative w-[105px]">
          <button
            onClick={() => setIsOpenAreaOfExpertise(!isOpenAreaOfExpertise)}
            className="w-full h-[26px] rounded-[4px] border border-[#EBEBEB] px-2 text-xs flex items-center justify-between"
          >
            <span className="text-[#6C6C6C] text-[10px]">
              {selectedAreaOfExpertise}
            </span>
            <div className="flex items-center">
              <FaCaretDown className="text-[#6C6C6C] text-[10px]" />
              {selectedAreaOfExpertise !== "Area of Expertise" && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAreaOfExpertise("Area of Expertise");
                  }}
                  className="ml-1 text-[10px] text-gray-500 cursor-pointer"
                >
                  ×
                </span>
              )}
            </div>
          </button>
          {isOpenAreaOfExpertise && (
            <div className="absolute top-[28px] left-0 w-[105px] bg-white border border-[#EBEBEB] rounded-[4px] shadow-sm z-10 max-h-[200px] overflow-y-auto">
              {AreaOfExpertiseOptions.map((option) => (
                <div
                  key={option}
                  onClick={() => {
                    setSelectedAreaOfExpertise(option);
                    setIsOpenAreaOfExpertise(false);
                  }}
                  className="px-2 py-1 text-[10px] text-[#6C6C6C] hover:bg-gray-100 cursor-pointer"
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Core Competency Filter */}
        <div className="relative w-[105px]">
          <button
            onClick={() => setIsOpenSBU(!isOpenSBU)}
            className="w-full h-[26px] rounded-[4px] border border-[#EBEBEB] px-2 text-xs flex items-center justify-between"
          >
            <span className="text-[#6C6C6C] text-[10px] truncate block max-w-[60px]">
              {selectedSBU}
            </span>
            <div className="flex items-center">
              <FaCaretDown className="text-[#6C6C6C] text-[10px]" />
              {selectedSBU !== "Core Competency" && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSBU("Core Competency");
                  }}
                  className="ml-1 text-[10px] text-gray-500 cursor-pointer"
                >
                  ×
                </span>
              )}
            </div>
          </button>
          {isOpenSBU && (
            <div className="absolute top-[28px] left-0 w-[105px] bg-white border border-[#EBEBEB] rounded-[4px] shadow-sm z-10 max-h-[200px] overflow-y-auto">
              {CoreCompetencyOptions.map((option) => (
                <div
                  key={option}
                  onClick={() => {
                    setSelectedSBU(option);
                    setIsOpenSBU(false);
                  }}
                  className="px-2 py-1 text-[10px] text-[#6C6C6C] hover:bg-gray-100 cursor-pointer"
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* View Mode Icons */}
        {isOverview && (
          <>
            <div
              className="w-[25px] h-[25px] cursor-pointer relative"
              onClick={() => setViewMode("grid")}
            >
              <Image
                src={
                  viewMode === "grid"
                    ? "/Grid_View_Active_Icon.png"
                    : "/Grid_View_Icon.png"
                }
                alt="Grid View"
                fill
                className="object-contain"
                sizes="25px"
              />
            </div>
            <div
              className="w-[25px] h-[25px] cursor-pointer relative"
              onClick={() => setViewMode("list")}
            >
              <Image
                src={
                  viewMode === "list"
                    ? "/List_View_Active_Icon.png"
                    : "/List_View_Icon.png"
                }
                alt="List View"
                fill
                className="object-contain"
                sizes="25px"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

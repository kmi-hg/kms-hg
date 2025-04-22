import { FaCaretDown } from "react-icons/fa";
import Image from "next/image";

interface SearchFilterBarProps {
  selectedAreaOfExpertise: string;
  setSelectedAreaOfExpertise: (value: string) => void;
  isOpenAreaOfExpertise: boolean;
  setIsOpenAreaOfExpertise: (value: boolean) => void;
  selectedSBU: string;
  setSelectedSBU: (value: string) => void;
  isOpenSBU: boolean;
  setIsOpenSBU: (value: boolean) => void;
  AreaOfExpertiseOptions: string[];
  SBUOptions: string[];
  viewMode: "grid" | "list";
  setViewMode: (value: "grid" | "list") => void;
  isOverview: boolean; 
}

export default function SearchFilterBar({
  selectedAreaOfExpertise,
  setSelectedAreaOfExpertise,
  isOpenAreaOfExpertise,
  setIsOpenAreaOfExpertise,
  selectedSBU,
  setSelectedSBU,
  isOpenSBU,
  setIsOpenSBU,
  AreaOfExpertiseOptions,
  SBUOptions,
  viewMode,
  setViewMode,
  isOverview, 
}: SearchFilterBarProps) {
  return (
    <div className="w-full h-[70px] border border-[#c2c2c2] rounded-[12px] px-[23.5px] py-[14px] flex gap-[13px] justify-center items-center mb-[20px]">
      {/* Search */}
      <div className="w-full h-full border border-[#c2c2c2] rounded-[12px] px-[18px] py-[9px]">
        <p className="text-[#6A6969]">Search</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-[12px]">
        {/* Area of Expertise Filter */}
        <div className="relative w-[105px]">
          <button
            onClick={() => setIsOpenAreaOfExpertise(!isOpenAreaOfExpertise)}
            className="w-[105px] h-[26px] rounded-[4px] border border-[#EBEBEB] px-2 text-xs flex items-center justify-between"
          >
            <span className="text-[#6C6C6C] text-[10px]">{selectedAreaOfExpertise}</span>
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
            <div className="absolute top-[28px] left-0 w-[105px] bg-white border border-[#EBEBEB] rounded-[4px] shadow-sm z-10">
              {AreaOfExpertiseOptions.map((area_of_expertise) => (
                <div
                  key={area_of_expertise}
                  onClick={() => {
                    setSelectedAreaOfExpertise(area_of_expertise);
                    setIsOpenAreaOfExpertise(false);
                  }}
                  className="px-2 py-1 text-[10px] text-[#6C6C6C] hover:bg-gray-100 cursor-pointer"
                >
                  {area_of_expertise}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SBU Filter */}
        <div className="relative w-[105px]">
          <button
            onClick={() => setIsOpenSBU(!isOpenSBU)}
            className="w-[105px] h-[26px] rounded-[4px] border border-[#EBEBEB] px-2 text-xs flex items-center justify-between"
          >
            <span className="text-[#6C6C6C] text-[10px]">{selectedSBU}</span>
            <div className="flex items-center">
              <FaCaretDown className="text-[#6C6C6C] text-[10px]" />
              {selectedSBU !== "SBU" && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSBU("SBU");
                  }}
                  className="ml-1 text-[10px] text-gray-500 cursor-pointer"
                >
                  ×
                </span>
              )}
            </div>
          </button>
          {isOpenSBU && (
            <div className="absolute top-[28px] left-0 w-[105px] bg-white border border-[#EBEBEB] rounded-[4px] shadow-sm z-10">
              {SBUOptions.map((sbu) => (
                <div
                  key={sbu}
                  onClick={() => {
                    setSelectedSBU(sbu);
                    setIsOpenSBU(false);
                  }}
                  className="px-2 py-1 text-[10px] text-[#6C6C6C] hover:bg-gray-100 cursor-pointer"
                >
                  {sbu}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* View Mode - Only for Overview */}
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

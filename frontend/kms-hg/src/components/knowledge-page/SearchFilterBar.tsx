import { FaCaretDown } from "react-icons/fa";
import Image from "next/image";

interface SearchFilterBarProps {
  selectedFields: string;
  setSelectedFields: (value: string) => void;
  isOpenFields: boolean;
  setIsOpenFields: (value: boolean) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
  isOpenType: boolean;
  setIsOpenType: (value: boolean) => void;
  FieldsOptions: string[];
  TypeOptions: string[];
  viewMode: "grid" | "list";
  setViewMode: (value: "grid" | "list") => void;
  isOverview: boolean;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export default function SearchFilterBar({
  selectedFields,
  setSelectedFields,
  isOpenFields,
  setIsOpenFields,
  selectedType,
  setSelectedType,
  isOpenType,
  setIsOpenType,
  FieldsOptions,
  TypeOptions,
  viewMode,
  setViewMode,
  isOverview,
  searchQuery,
  setSearchQuery,
}: SearchFilterBarProps) {
  return (
    <div className="w-full h-[70px] border border-[#c2c2c2] rounded-[12px] px-[23.5px] py-[14px] flex gap-[13px] justify-center items-center mb-[20px]">
      {/* Search */}
      <div className="w-full h-full border border-[#c2c2c2] rounded-[12px] px-[18px] py-[9px] flex items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="w-full text-sm text-[#6A6969] border-none outline-none focus:outline-none focus:border-none"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-[12px]">
        {/* Fields Filter */}
        <div className="relative w-[105px]">
          <button
            onClick={() => setIsOpenFields(!isOpenFields)}
            className="w-[105px] h-[26px] rounded-[4px] border border-[#EBEBEB] px-2 text-xs flex items-center justify-between"
          >
            <span className="text-[#6C6C6C] text-[10px]">{selectedFields}</span>
            <div className="flex items-center">
              <FaCaretDown className="text-[#6C6C6C] text-[10px]" />
              {selectedFields !== "Fields" && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFields("Fields");
                  }}
                  className="ml-1 text-[10px] text-gray-500 cursor-pointer"
                >
                  ×
                </span>
              )}
            </div>
          </button>
          {isOpenFields && (
            <div className="absolute top-[28px] left-0 w-[105px] bg-white border border-[#EBEBEB] rounded-[4px] shadow-sm z-10">
              {FieldsOptions.map((field) => (
                <div
                  key={field}
                  onClick={() => {
                    setSelectedFields(field);
                    setIsOpenFields(false);
                  }}
                  className="px-2 py-1 text-[10px] text-[#6C6C6C] hover:bg-gray-100 cursor-pointer"
                >
                  {field}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Type Filter */}
        <div className="relative w-[105px]">
          <button
            onClick={() => setIsOpenType(!isOpenType)}
            className="w-[105px] h-[26px] rounded-[4px] border border-[#EBEBEB] px-2 text-xs flex items-center justify-between"
          >
            <span className="text-[#6C6C6C] text-[10px]">{selectedType}</span>
            <div className="flex items-center">
              <FaCaretDown className="text-[#6C6C6C] text-[10px]" />
              {selectedType !== "Type" && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedType("Type");
                  }}
                  className="ml-1 text-[10px] text-gray-500 cursor-pointer"
                >
                  ×
                </span>
              )}
            </div>
          </button>
          {isOpenType && (
            <div className="absolute top-[28px] left-0 w-[105px] bg-white border border-[#EBEBEB] rounded-[4px] shadow-sm z-10">
              {TypeOptions.map((type) => (
                <div
                  key={type}
                  onClick={() => {
                    setSelectedType(type);
                    setIsOpenType(false);
                  }}
                  className="px-2 py-1 text-[10px] text-[#6C6C6C] hover:bg-gray-100 cursor-pointer"
                >
                  {type}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* View Mode Toggle */}
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

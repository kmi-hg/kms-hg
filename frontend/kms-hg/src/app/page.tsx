"use client";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import RecentlyOpenedCard from "@/app/components/recently-opened-card";
import Header from "./components/header";
import KnowledgeCard from "./components/knowledge-card";
import Link from "next/link";
import SearchBar from "./components/search-bar";

export default function Home() {
  const [isOpenFields, setIsOpenFields] = useState(false);
  const [isOpenType, setIsOpenType] = useState(false);
  const [selectedFields, setSelectedFields] = useState("Fields");
  const [selectedType, setSelectedType] = useState("Type");

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const FieldsOptions = ["DSA", "JS", "Python", "Java", "C++"];
  const TypeOptions = ["DSA", "JS", "Python", "Java", "C++"];

  const handleSelectFields = (value: string) => {
    setSelectedFields(value);
    setIsOpenFields(false);
  };

  const handleSelectType = (value: string) => {
    setSelectedType(value);
    setIsOpenType(false);
  };

  return (
    <div>
      <Header />

      {/* Recently Opened Files Section */}
      <section>
        <h2 className="text-lg font-semibold text-black mb-2 text-[24px] mt-[30px] mb-[30px] font-figtree">
          Recently Opened
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[17px]">
          {[...Array(4)].map((_, index) => (
            <RecentlyOpenedCard key={index} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-lg font-semibold text-black mb-2 text-[24px] mt-[30px] mb-[30px] font-figtree">
          Features
        </h2>
        <div className="flex items-center gap-[30px]">
          {/* Subject Matter Expert */}
          <Link href="/subject-matter-expert" passHref>
            <div
              className="flex items-center w-full lg:w-[325px] h-[77px] bg-white rounded-[12px] p-4 gap-4"
              style={{ boxShadow: "0px 0px 5.6px 0px rgba(0, 0, 0, 0.25)" }}
            >
              <div className="w-[48px] h-[48px] bg-[#3D5AFE] flex items-center justify-center rounded-full">
                <div className="h-[30px] w-[30px]">
                  <img src="SME_Icon.png" alt="Subject Matter Expert" />
                </div>
              </div>
              <div>
                <h3 className="text-black font-semibold text-[18px] font-figtree">
                  Subject Matter Expert
                </h3>
                <p className="text-[#595959] font-semibold text-[14px] font-figtree">
                  Ask the Expert
                </p>
              </div>
            </div>
          </Link>

          {/* Hasnur Chat */}
          <div
            className="flex items-center w-full lg:w-[325px] h-[77px] bg-white rounded-[12px] p-4 gap-4"
            style={{ boxShadow: "0px 0px 5.6px 0px rgba(0, 0, 0, 0.25)" }}
          >
            <div className="w-[48px] h-[48px] bg-[#3D5AFE] flex items-center justify-center rounded-full">
              <div className="h-[30px] w-[30px]">
                <img src="HasnurChat_Icon.png" alt="Hasnur Chat" />
              </div>
            </div>
            <div>
              <h3 className="text-black font-semibold text-[18px] font-figtree">
                Hasnur Chat
              </h3>
              <p className="text-[#595959] font-semibold text-[14px] font-figtree">
                Ask the AI
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* All Files Section */}
      <section>
        <h2 className="text-lg font-semibold text-black mb-2 text-[24px] mt-[30px] mb-[30px] font-figtree">
          All Files
        </h2>

        {/* Search & Filter Bar */}
        <div className="w-full h-[70px] border border-[#c2c2c2] rounded-[12px] px-[23.5px] py-[14px] flex gap-[13px] justify-center">
          {/* Search Bar */}
          <SearchBar />
          <div className="w-[320px] h-full flex items-center justify-center rounded-[8px] gap-[12px]">
            {/* Fields Filtering */}
            <div className="relative w-[105px]">
              <button
                onClick={() => setIsOpenFields(!isOpenFields)}
                className="w-[105px] h-[26px] rounded-[4px] border border-[#EBEBEB] px-2 text-xs flex items-center justify-between"
              >
                <span className="text-[#6C6C6C] text-[10px]">
                  {selectedFields}
                </span>
                <div className="flex justify-end items-center">
                  <FaCaretDown className="text-[#6C6C6C] text-[10px]" />
                  {selectedFields !== "Fields" && (
                    <button
                      onClick={() => setSelectedFields("Fields")}
                      className="text-[10px] text-gray-500"
                    >
                      ×
                    </button>
                  )}
                </div>
              </button>
              {isOpenFields && (
                <div className="absolute top-[28px] left-0 w-[105px] bg-white border border-[#EBEBEB] rounded-[4px] shadow-sm z-10">
                  {FieldsOptions.map((FieldsOptions) => (
                    <div
                      key={FieldsOptions}
                      onClick={() => handleSelectFields(FieldsOptions)}
                      className="px-2 py-1 text-[10px] text-[#6C6C6C] hover:bg-gray-100 cursor-pointer"
                    >
                      {FieldsOptions}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Type Filtering */}
            <div className="relative w-[105px]">
              <button
                onClick={() => setIsOpenType(!isOpenType)}
                className="w-[105px] h-[26px] rounded-[4px] border border-[#EBEBEB] px-2 text-xs flex items-center justify-between"
              >
                <span className="text-[#6C6C6C] text-[10px]">
                  {selectedType}
                </span>
                <div className="flex justify-end items-center">
                  <FaCaretDown className="text-[#6C6C6C] text-[10px]" />
                  {selectedType !== "Type" && (
                    <button
                      onClick={() => setSelectedType("Type")}
                      className="ml-1 text-[10px] text-gray-500"
                    >
                      ×
                    </button>
                  )}
                </div>
              </button>
              {isOpenType && (
                <div className="absolute top-[28px] left-0 w-[105px] bg-white border border-[#EBEBEB] rounded-[4px] shadow-sm z-10">
                  {TypeOptions.map((TypeOptions) => (
                    <div
                      key={TypeOptions}
                      onClick={() => handleSelectType(TypeOptions)}
                      className="px-2 py-1 text-[10px] text-[#6C6C6C] hover:bg-gray-100 cursor-pointer"
                    >
                      {TypeOptions}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bookmark */}
            <div className="w-[21px] h-[27px] cursor-pointer">
              <img
                src="Bookmark_Icon.png"
                alt="Bookmark"
                className="object-cover"
              />
            </div>

            {/* Grid View Icon */}
            <div
              className="w-[25px] h-[25px] cursor-pointer"
              onClick={() => setViewMode("grid")}
            >
              <img
                src={
                  viewMode === "grid"
                    ? "Grid_View_Active_Icon.png"
                    : "Grid_View_Icon.png"
                }
                alt="Grid View"
                className="object-cover"
              />
            </div>

            {/* List View Icon */}
            <div
              className="w-[25px] h-[25px] cursor-pointer"
              onClick={() => setViewMode("list")}
            >
              <img
                src={
                  viewMode === "list"
                    ? "List_View_Active_Icon.png"
                    : "List_View_Icon.png"
                }
                alt="List View"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* GRID or LIST VIEW */}
        {viewMode === "grid" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 lg:gap-[17px] mt-[20px]">
            {[...Array(12)].map((_, index) => (
              <KnowledgeCard key={index} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-[200px] mt-[20px]">
            <p className="text-gray-400 text-sm font-figtree">No file added</p>
          </div>
        )}
      </section>
    </div>
  );
}

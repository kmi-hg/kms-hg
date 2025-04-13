"use client";
import { useState } from "react";
import {
  FeatureCard,
  Header,
  KnowledgeCard,
  Modal,
  RecentlyOpenedCard,
  SearchBar,
  TabNavigation,
} from "@/app";
import { FaCaretDown } from "react-icons/fa";
import { useUpload } from "@/hooks/useUpload";
import { useFilter } from "@/hooks/useFilter";

export default function Home() {
  const userRole = "KMI";
  const FieldsOptions = ["DSA", "JS", "Python", "Java", "C++"];
  const TypeOptions = ["DSA", "JS", "Python", "Java", "C++"];
  const [activeTab, setActiveTab] = useState<"overview" | "add">("overview");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const {
    fileInputRef,
    droppedFile,
    isModalOpen,
    openModal,
    closeModal,
    handleFileChange,
    handleDrop,
  } = useUpload();

  const {
    selectedFields,
    selectedType,
    isOpenFields,
    isOpenType,
    setSelectedFields,
    setSelectedType,
    setIsOpenFields,
    setIsOpenType,
  } = useFilter();

  return (
    <div>
      <Header />
      <Modal isOpen={isModalOpen} closeModal={closeModal} file={droppedFile} />

      {/* Recently Opened */}
      <section>
        <h2 className="text-[24px] mt-[30px] mb-[30px] font-semibold font-figtree text-black">
          Recently Opened
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[17px]">
          {[...Array(4)].map((_, index) => (
            <RecentlyOpenedCard key={index} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-[24px] mt-[30px] mb-[30px] font-semibold font-figtree text-black">
          Features
        </h2>
        <div className="flex items-center gap-[30px]">
          <FeatureCard
            href="/subject-matter-expert"
            iconSrc="SME_Icon.png"
            title="Subject Matter Expert"
            description="Ask the Expert"
          />
          <FeatureCard
            href="#"
            iconSrc="HasnurChat_Icon.png"
            title="Hasnur Chat"
            description="Ask the AI"
          />
        </div>
      </section>

      {/* All Files Section */}
      <section className="mt-[30px]">
        <h2 className="text-[24px] font-semibold font-figtree text-black mb-[20px]">
          All Files
        </h2>

        {userRole === "KMI" && (
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        )}

        {/* Search Bar & Filters */}
        <div className="w-full h-[70px] border border-[#c2c2c2] rounded-[12px] px-[23.5px] py-[14px] flex gap-[13px] justify-center items-center mb-[20px]">
          <SearchBar />
          <div className="flex items-center gap-[12px]">
            {/* Fields Filter */}
            <div className="relative w-[105px]">
              <button
                onClick={() => setIsOpenFields(!isOpenFields)}
                className="w-[105px] h-[26px] rounded-[4px] border border-[#EBEBEB] px-2 text-xs flex items-center justify-between"
              >
                <span className="text-[#6C6C6C] text-[10px]">
                  {selectedFields}
                </span>
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
                <span className="text-[#6C6C6C] text-[10px]">
                  {selectedType}
                </span>
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

            {/* View Switch */}
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
              />
            </div>
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
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        {activeTab === "overview" ? (
          viewMode === "grid" ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 lg:gap-[17px]">
              {[...Array(12)].map((_, index) => (
                <KnowledgeCard key={index} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-[200px]">
              <p className="text-gray-400 text-sm font-figtree">
                No file added
              </p>
            </div>
          )
        ) : (
          <>
            <input
              type="file"
              ref={fileInputRef}
              accept="application/pdf"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <div
              className="w-full h-[250px] border border-dashed border-[#D9D9D9] bg-[#FCFBFC] rounded-[8px] flex flex-col items-center justify-center text-center px-4"
              onClick={openModal}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <img
                src="/upload_icon.png"
                alt="Upload"
                className="w-[20px] h-[25px] mb-2"
              />
              <div className="w-[300px]">
                <p className="text-[#6B6B6B] text-[20px]">
                  Drop your knowledge here, or{" "}
                  <span
                    className="text-[#3D5AFE] font-medium cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    click to browse
                  </span>
                </p>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

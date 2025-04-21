"use client";

import { useState } from "react";
import {
  FeatureCard,
  Header,
  Modal,
  RecentlyOpenedCard,
  TabNavigation,
} from "@/app";
import { useUpload } from "@/hooks/useUpload";
import { useFilter } from "@/hooks/useFilter";
import KnowledgeList from "../components/knowledge-page/KnowledgeList";
import Image from "next/image";
import KnowledgeTable from "../components/knowledge-page/KnowledgeTable";
import SearchFilterBar from "../components/knowledge-page/SearchFilterBar";

export default function Home() {
  const userRole = "KMI";
  const FieldsOptions = [
    "Corsec/Corplan",
    "Operation",
    "HCGS",
    "Procurement",
    "Others",
    "Fleet Mgt",
    "FAT",
    "GRCD",
    "Legal & permit",
    "Marketing & Sales",
  ];
  const TypeOptions = ["PDF", "MP3"];

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
            iconSrc="/SME_Icon.png"
            title="Subject Matter Expert"
            description="Ask the Expert"
          />
          <FeatureCard
            href="#"
            iconSrc="/HasnurChat_Icon.png"
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

        {/* Tab Navigation */}
        {userRole === "KMI" && (
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        )}

        {/* FilterBar - tampil di semua tab */}
        <SearchFilterBar
          selectedFields={selectedFields}
          setSelectedFields={setSelectedFields}
          isOpenFields={isOpenFields}
          setIsOpenFields={setIsOpenFields}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          isOpenType={isOpenType}
          setIsOpenType={setIsOpenType}
          FieldsOptions={FieldsOptions}
          TypeOptions={TypeOptions}
          viewMode={viewMode}
          setViewMode={setViewMode}
          isOverview={activeTab === "overview"}
        />

        {/* Main Content */}
        {activeTab === "overview" ? (
          viewMode === "grid" ? (
            <div>
              <KnowledgeList />
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
            {/* Upload Area */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf, .mp3"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <div
              className="w-full h-[250px] border border-dashed border-[#D9D9D9] bg-[#FCFBFC] rounded-[8px] flex flex-col items-center justify-center text-center px-4"
              onClick={openModal}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <Image
                src="/upload_icon.png"
                alt="Upload"
                className="w-[20px] h-[25px] mb-2"
                width={20}
                height={25}
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

            {/* List Uploaded Knowledge */}
            <KnowledgeTable />
          </>
        )}
      </section>
    </div>
  );
}

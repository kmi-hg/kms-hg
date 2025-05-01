"use client";

import { useEffect, useState } from "react";
import {
  FeatureCard,
  Header,
  Modal,
  RecentlyOpenedCard,
  TabNavigation,
} from "@/app";
import { useUpload } from "@/hooks/useUpload";
import { useFilter } from "@/hooks/useFilter";
import KnowledgeList from "../../../components/knowledge-page/KnowledgeList";
import Image from "next/image";
import KnowledgeTable from "../../../components/knowledge-page/KnowledgeTable";
import SearchFilterBar from "../../../components/knowledge-page/SearchFilterBar";
import { useSession } from "next-auth/react";

type KnowledgeClientProps = {
  role: string;
};

type RecentlyOpenedFile = {
  fileId: string;
  fileName: string;
  fileUrl: string;
  size: number;
  openedAt: string;
  thumbnailPath?: string;
};

export default function KnowledgeClient({ role }: KnowledgeClientProps) {
  const { data: session } = useSession();
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

  const [searchQuery, setSearchQuery] = useState("");
  const [recentlyOpenedFiles, setRecentlyOpenedFiles] = useState<
    RecentlyOpenedFile[]
  >([]);

  const userRole = role;
  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) return;

    fetch(`/api/recently-opened-files?userId=${userId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data: RecentlyOpenedFile[]) => {
        const sortedFiles = data.sort(
          (a, b) =>
            new Date(b.openedAt).getTime() - new Date(a.openedAt).getTime()
        );
        setRecentlyOpenedFiles(sortedFiles);
      })
      .catch((error) => {
        console.error("Error fetching recently opened files:", error);
        setRecentlyOpenedFiles([]);
      });
  }, [userId]);

  if (!role) {
    return <div>Error: Role tidak ditemukan</div>;
  }

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

  return (
    <div className="px-[80px] pt-[16px]">
      <Header />
      <Modal isOpen={isModalOpen} closeModal={closeModal} file={droppedFile} />

      <section className="mt-[30px]">
        <h2 className="text-[24px] mb-[30px] font-semibold font-figtree text-black">
          Recently Opened
        </h2>
        {recentlyOpenedFiles.length === 0 ? (
          <p className="text-gray-500">You haven&apos;t opened any files</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[17px]">
            {recentlyOpenedFiles.slice(0, 4).map((file) => (
              <RecentlyOpenedCard key={file.fileId} file={file} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-[30px]">
        <h2 className="text-[24px] mb-[30px] font-semibold font-figtree text-black">
          Features
        </h2>
        <div className="flex items-center gap-[30px]">
          <FeatureCard
            href={`/subject-matter-expert?role=${role}`}
            iconSrc="/SME_Icon.png"
            title="Subject Matter Expert"
            description="Ask the Expert"
          />
          {/* <FeatureCard
            href="#"
            iconSrc="/HasnurChat_Icon.png"
            title="Hasnur Chat"
            description="Ask the AI"
          /> */}
        </div>
      </section>

      <section className="mt-[30px]">
        <h2 className="text-[24px] font-semibold font-figtree text-black mb-[20px]">
          All Files
        </h2>

        {userRole === "KMI" && (
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        )}

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
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {activeTab === "overview" ? (
          viewMode === "grid" ? (
            <KnowledgeList
              searchQuery={searchQuery}
              selectedField={selectedFields}
              selectedType={selectedType}
            />
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
            <KnowledgeTable
              searchQuery={searchQuery}
              selectedFields={selectedFields}
              selectedType={selectedType}
            />
          </>
        )}
      </section>
    </div>
  );
}

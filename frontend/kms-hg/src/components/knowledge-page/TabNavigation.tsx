// /components/TabNavigation.tsx
import React from "react";

export default function TabNavigation({
  activeTab,
  setActiveTab,
}: {
  activeTab: "overview" | "add";
  setActiveTab: React.Dispatch<React.SetStateAction<"overview" | "add">>;
}) {
  return (
    <div className="w-full h-[33px] flex items-center border-b border-[#D9D9D9] mb-[20px]">
      <button
        onClick={() => setActiveTab("overview")}
        className={`text-[18px] font-medium h-full px-4 ${
          activeTab === "overview"
            ? "text-[#3D5AFE] border-b-[2px] border-[#3D5AFE]"
            : "text-[#8A8A8A]"
        }`}
      >
        Overview
      </button>
      <button
        onClick={() => setActiveTab("add")}
        className={`text-[18px] font-medium h-full px-4 flex items-center gap-1 ${
          activeTab === "add"
            ? "text-[#3D5AFE] border-b-[2px] border-[#3D5AFE]"
            : "text-[#8A8A8A]"
        }`}
      >
        <span className="text-[18px] font-bold">+</span> Add Documents
      </button>
    </div>
  );
}

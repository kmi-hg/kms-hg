"use client";

import { useState, useEffect } from "react";
import SMECard from "../../../components/sme-page/SMECard";
import SMEDetailModal from "../../../components/sme-page/SMEDetailModal";
import TabNavigation from "../../../components/sme-page/TabNavigation";
import SearchFilterBar from "@/components/sme-page/SearchFilterBar";
import { useFilter } from "@/hooks/useFilter";

interface SME {
  id: number;
  name: string;
  email: string;
  profile_url: string;
  area_of_expertise: string;
  sbu: string;
  bio: string;
}

type SMEClientProps = {
  role: string;
};

export default function SMEClient({ role }: SMEClientProps) {
  const [smeList, setSmeList] = useState<SME[]>([]);
  const [selectedSME, setSelectedSME] = useState<SME | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "add">("overview");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const AreaOfExpertiseOptions = [
    "Logisic",
    "Argo Forestry",
    "Energy",
    "Technology & Services",
    "Education",
    "Consumer",
    "Investment",
  ];
  const SBUOptions = [
    "Logisic",
    "Argo Forestry",
    "Energy",
    "Technology & Services",
    "Education",
    "Consumer",
    "Investment",
  ];

  const {
    selectedFields: selectedAreaOfExpertise,
    selectedType: selectedSBU,
    isOpenFields: isOpenAreaOfExpertise,
    isOpenType: isOpenSBU,
    setSelectedFields: setSelectedAreaOfExpertise,
    setSelectedType: setSelectedSBU,
    setIsOpenFields: setIsOpenAreaOfExpertise,
    setIsOpenType: setIsOpenSBU,
  } = useFilter();

  useEffect(() => {
    setSelectedAreaOfExpertise("Area of Expertise");
    setSelectedSBU("SBU");
  }, []);

  useEffect(() => {
    const fetchSMEs = async () => {
      try {
        const res = await fetch("/api/expert");
        const data = await res.json();
        setSmeList(data);
      } catch (error) {
        console.error("Failed to fetch SME data:", error);
      }
    };

    fetchSMEs();
  }, []);

  return (
    <>
      {role === "KMI" && (
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      )}

      <SearchFilterBar
        selectedAreaOfExpertise={selectedAreaOfExpertise}
        setSelectedAreaOfExpertise={setSelectedAreaOfExpertise}
        isOpenAreaOfExpertise={isOpenAreaOfExpertise}
        setIsOpenAreaOfExpertise={setIsOpenAreaOfExpertise}
        selectedSBU={selectedSBU}
        setSelectedSBU={setSelectedSBU}
        isOpenSBU={isOpenSBU}
        setIsOpenSBU={setIsOpenSBU}
        AreaOfExpertiseOptions={AreaOfExpertiseOptions}
        SBUOptions={SBUOptions}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isOverview={activeTab === "overview"}
      />

      <br />

      {activeTab === "overview" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[17px]">
          {smeList.map((sme) => (
            <div
              key={sme.id}
              onClick={() => setSelectedSME(sme)}
              className="cursor-pointer"
            >
              <SMECard
                name={sme.name}
                email={sme.email}
                profile_url={sme.profile_url}
                area_of_expertise={sme.area_of_expertise}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="h-[200px] flex items-center justify-center text-gray-400">
          SME upload form or placeholder here.
        </div>
      )}

      <SMEDetailModal
        isOpen={!!selectedSME}
        sme={selectedSME}
        onClose={() => setSelectedSME(null)}
      />
    </>
  );
}

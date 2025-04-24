"use client";

import { useState, useEffect, useMemo } from "react";
import SMECard from "../../../components/sme-page/SMECard";
import SMEDetailModal from "../../../components/sme-page/SMEDetailModal";
import TabNavigation from "../../../components/sme-page/TabNavigation";
import SearchFilterBar from "@/components/sme-page/SearchFilterBar";
import { useFilter } from "@/hooks/useFilter";
import Image from "next/image";
import SMETable from "@/components/sme-page/SMETable";

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
  const [selectedExpertise, setSelectedExpertise] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const AreaOfExpertiseOptions = [
    "Logistic",
    "Argo Forestry",
    "Energy",
    "Technology & Services",
    "Education",
    "Consumer",
    "Investment",
  ];
  const SBUOptions = [
    "Logistic",
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

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sbu, setSbu] = useState("");
  const [bio, setBio] = useState("");

  const [isEditMode, setIsEditMode] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !sbu || !bio || !selectedExpertise) {
      alert("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("sbu", sbu);
    formData.append("bio", bio);
    formData.append("area_of_expertise", selectedExpertise);
    if (profilePicture) {
      formData.append("profile_picture", profilePicture);
    }

    if (isEditMode && selectedSME) {
      formData.append("id", selectedSME.id.toString());
    }

    try {
      const res = await fetch("/api/expert", {
        method: isEditMode ? "PUT" : "POST",
        body: formData,
      });

      if (res.ok) {
        alert(
          isEditMode
            ? "SME updated successfully!"
            : "SME uploaded successfully!"
        );
        setName("");
        setEmail("");
        setSbu("");
        setBio("");
        setSelectedExpertise("");
        setProfilePicture(null);
        setPreviewUrl(null);
        setSelectedSME(null);
        setIsEditMode(false);
        setActiveTab("overview");

        const updated = await fetch("/api/expert");
        const data = await updated.json();
        setSmeList(data);
      } else {
        const error = await res.json();
        alert(error.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  // ✅ Filtering for overview (grid view with cards)
  const filteredSMEs = useMemo(() => {
    return smeList.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.area_of_expertise
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.sbu.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesExpertise =
        selectedAreaOfExpertise === "Area of Expertise" ||
        item.area_of_expertise === selectedAreaOfExpertise;

      const matchesSBU = selectedSBU === "SBU" || item.sbu === selectedSBU;

      return matchesSearch && matchesExpertise && matchesSBU;
    });
  }, [smeList, searchQuery, selectedAreaOfExpertise, selectedSBU]);

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
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <br />

      {activeTab === "overview" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[17px]">
          {filteredSMEs.map((sme) => (
            <div
              key={sme.id}
              onClick={() => {
                setSelectedSME(sme);
                setIsDetailOpen(true);
              }}
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
        <>
          {/* UPLOAD FORM */}
          {/* ... (unchanged form code) ... */}
          <br />
          <SMETable
            data={smeList}
            selectedAreaOfExpertise={selectedAreaOfExpertise}
            selectedSBU={selectedSBU}
            searchQuery={searchQuery}
            onDelete={async (id) => {
              const confirm = window.confirm(
                "Are you sure you want to delete this expert?"
              );
              if (!confirm) return;
              try {
                const res = await fetch(`/api/expert`, {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id }),
                });
                if (res.ok) {
                  setSmeList((prev) => prev.filter((s) => s.id !== id));
                } else {
                  alert("Failed to delete");
                }
              } catch (err) {
                console.error(err);
                alert("Unexpected error");
              }
            }}
            onEdit={(sme) => {
              setSelectedSME(sme);
              setName(sme.name);
              setEmail(sme.email);
              setSbu(sme.sbu);
              setBio(sme.bio);
              setSelectedExpertise(sme.area_of_expertise);
              setPreviewUrl(sme.profile_url);
              setIsEditMode(true);
              setActiveTab("add");
            }}
          />
        </>
      )}

      <SMEDetailModal
        isOpen={isDetailOpen}
        sme={selectedSME}
        onClose={() => {
          setSelectedSME(null);
          setIsDetailOpen(false);
        }}
      />
    </>
  );
}

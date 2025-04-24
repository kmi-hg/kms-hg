"use client";

import { useState, useEffect, useMemo } from "react";
import SMECard from "../../../components/sme-page/SMECard";
import SMEDetailModal from "../../../components/sme-page/SMEDetailModal";
import TabNavigation from "../../../components/sme-page/TabNavigation";
import SearchFilterBar from "@/components/sme-page/SearchFilterBar";
import { useFilter } from "@/hooks/useFilter";
import SMETable from "@/components/sme-page/SMETable";
import Image from "next/image";

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

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sbu, setSbu] = useState("");
  const [bio, setBio] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const AreaOfExpertiseOptions = [
    "Logistic",
    "Argo Forestry",
    "Energy",
    "Technology & Services",
    "Education",
    "Consumer",
    "Investment",
  ];
  const SBUOptions = [...AreaOfExpertiseOptions];

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

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("Selected file:", file);
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setSbu("");
    setBio("");
    setSelectedExpertise("");
    setProfilePicture(null);
    setPreviewUrl(null);
    setIsEditMode(false);
    setSelectedSME(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form values:", {
      profilePicture,
      name,
      email,
      sbu,
      bio,
      selectedExpertise,
      isEditMode,
    });

    if (
      (!profilePicture && !isEditMode) ||
      !name.trim() ||
      !email.trim() ||
      !sbu.trim() ||
      !bio.trim() ||
      !selectedExpertise.trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    if (profilePicture) {
      formData.append("profile_picture", profilePicture);
    }
    formData.append("name", name);
    formData.append("email", email);
    formData.append("sbu", sbu);
    formData.append("bio", bio);
    formData.append("area_of_expertise", selectedExpertise);

    if (isEditMode && selectedSME) {
      formData.append("id", String(selectedSME.id));
    }

    try {
      const method = isEditMode ? "PUT" : "POST";
      const res = await fetch("/api/expert", {
        method,
        body: formData,
      });

      if (res.ok) {
        alert(
          isEditMode ? "SME updated successfully!" : "SME added successfully!"
        );
        resetForm();
        setActiveTab("overview");

        const updated = await fetch("/api/expert");
        const data = await updated.json();
        setSmeList(data);
      } else {
        const error = await res.json();
        alert(error.error || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

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
          <form onSubmit={handleSubmit} className="flex gap-[50px]">
            {/* Profile Picture Upload */}
            <div className="h-[210px] w-[210px] flex justify-center items-start">
              <div
                className="w-[210px] h-[210px] rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-4xl cursor-pointer relative overflow-hidden"
                onClick={() =>
                  document.getElementById("profile-upload")?.click()
                }
              >
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                ) : (
                  "+"
                )}
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePicChange}
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="w-full flex flex-col gap-6">
              <div className="grid md:grid-cols-3 gap-[20px]">
                <div>
                  <label className="text-[18px] font-medium text-black">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-[12px] text-black"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[18px] font-medium text-black">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-[12px] text-black"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[18px] font-medium text-black">
                    SBU
                  </label>
                  <select
                    value={sbu}
                    onChange={(e) => setSbu(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-[12px] text-black"
                  >
                    <option value="">Select SBU</option>
                    {SBUOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-[20px]">
                <div className="md:col-span-2">
                  <label className="text-[18px] font-medium text-black">
                    Bio
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md mt-[12px] px-3 py-2 h-[150px] "
                    placeholder="Enter bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <label className="text-[18px] font-medium text-black mb-1 block">
                      Area of Expertise
                    </label>
                    <div className="flex flex-wrap gap-2 mt-[12px]">
                      {AreaOfExpertiseOptions.map((area) => {
                        const isActive = selectedExpertise === area;
                        return (
                          <button
                            key={area}
                            type="button"
                            onClick={() => setSelectedExpertise(area)}
                            className={`rounded-[4px] px-[6px] py-[3px] text-[14px] font-semibold border ${
                              isActive
                                ? "bg-[#3A40D4] text-white border-[#3A40D4]"
                                : "text-[#7F7F7F] border-[#c3c3c3] hover:bg-gray-100"
                            }`}
                          >
                            + {area}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <button
                      type="submit"
                      className="bg-[#3A40D4] text-white px-6 py-2 rounded-[8px] text-[16px] transition w-[115px] h-[41px]"
                    >
                      {isEditMode ? "Update" : "Add"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>

          <br />

          <SMETable
            data={smeList}
            selectedAreaOfExpertise={selectedAreaOfExpertise}
            selectedSBU={selectedSBU}
            searchQuery={searchQuery}
            onDelete={async (id) => {
              const confirmDelete = window.confirm(
                "Are you sure you want to delete this expert?"
              );
              if (!confirmDelete) return;

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

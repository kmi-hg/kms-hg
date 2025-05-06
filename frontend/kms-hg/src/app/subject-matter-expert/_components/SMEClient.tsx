"use client";

import { useState, useEffect, useMemo } from "react";
import SMECard from "../../../components/sme-page/SMECard";
import SMEDetailModal from "../../../components/sme-page/SMEDetailModal";
import TabNavigation from "../../../components/sme-page/TabNavigation";
import SearchFilterBar from "@/components/sme-page/SearchFilterBar";
import { useFilter } from "@/hooks/useFilter";
import SMETable from "@/components/sme-page/SMETable";
import Image from "next/image";
import SuccessModal from "@/components/sme-page/SuccessModal";

interface Expert {
  id: number;
  name: string;
  email: string;
  profile_url: string;
  department: string; 
  position: string;
  entitas: string; 
  expertise: string; 
  core_competency: string[]; 
  bio: string;
}

type SMEClientProps = {
  role: string;
};

export default function SMEClient({ role }: SMEClientProps) {
  // State declarations
  const [smeList, setSmeList] = useState<Expert[]>([]);
  const [selectedSME, setSelectedSME] = useState<Expert | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "add">("overview");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedExpertise, setSelectedExpertise] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isProfileRemoved, setIsProfileRemoved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const DEFAULT_PROFILE_URL = "/default-profile-picture.png";

  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [entitas, setEntitas] = useState("");
  const [coreCompetency, setCoreCompetency] = useState<string[]>([]);

  const DepartmentOptions = [
    "Committee Nomination & Human Capital",
    "Department Procurement (Holding)",
    "Division Corporate Secretary",
    "Department Risk Management",
    "Department Hc Operations",
    "Department Accounting & Tax",
    "Department Finance",
    "Department Legal & Corcomm",
    "Department Hcgs Development",
    "Department Infrastructure & Sys Adm",
    "Direktorat Finance & Administration",
    "Division Operations",
    "Operation Office Presdir",
    "Division Agribusiness",
    "Department Agronomy",
    "Section General Admin",
    "Section Operation",
    "Department Human Capital",
    "Department General Services",
    "She",
    "Department Technical Maintenance",
    "Department Business Solution",
    "Departement Planning & Permit",
    "Department Hrgs",
  ];

  const EntitasOptions = [
    "PT CDI",
    "PT HCT",
    "PT HGI",
    "PT HIS",
    "PT HIT",
    "PT SRP",
    "PT HCK",
    "PT BPP",
    "PT EBL",
  ];

  const CoreCompetencyOptions = [
    "Integrity",
    "Stakeholders Orientation",
    "Organizational Commitment",
    "Teamwork",
    "Achievement Orientation",
    "Transformational Leadership",
    "Problem Solving & Decisive Judgement",
    "Planning & Organizing",
    "Developing Others",
    "Business Acumen",
    "Continuous Improvement",
    "Communication",
  ];

  // Options for Area of Expertise and SBU
  const AreaOfExpertiseOptions = [
    "Marketing & Sales",
    "HC",
    "Procurement",
    "Legal",
    "Risk Management",
    "Finance",
    "Corporate Communication",
    "IT",
    "Engineer",
    "Operation",
    "SHE",
  ];

  // Handling Filter Logic
  const {
    selectedFields: selectedAreaOfExpertise,
    selectedType: selectedCoreCompetency,
    isOpenFields: isOpenAreaOfExpertise,
    isOpenType: isOpenCoreCompetency,
    setSelectedFields: setSelectedAreaOfExpertise,
    setSelectedType: setSelectedCoreCompetency,
    setIsOpenFields: setIsOpenAreaOfExpertise,
    setIsOpenType: setIsOpenCoreCompetency,
  } = useFilter();

  useEffect(() => {
    setSelectedAreaOfExpertise("Area of Expertise");
    setSelectedCoreCompetency("Core Competency");
  }, [setSelectedAreaOfExpertise, setSelectedCoreCompetency]);

  // Fetching SME list from the API
  useEffect(() => {
    const fetchSMEs = async () => {
      try {
        const res = await fetch("/api/expert");
        const data = await res.json();

        // Make sure it's an array
        if (Array.isArray(data)) {
          setSmeList(data);
        } else if (Array.isArray(data?.experts)) {
          setSmeList(data.experts); // Or adjust this based on the actual key
        } else {
          console.error("Unexpected data format:", data);
          setSmeList([]); // fallback to empty array
        }
      } catch (error) {
        console.error("Failed to fetch SME data:", error);
        setSmeList([]); // fallback to empty array on error
      }
    };

    fetchSMEs();
  }, []);

  // Profile picture handler
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setName("");
    setEmail("");
    setDepartment("");
    setBio("");
    setSelectedExpertise("");
    setProfilePicture(null);
    setPreviewUrl(null);
    setIsEditMode(false);
    setSelectedSME(null);
    setIsProfileRemoved(false);
  };

  // Submit handler for adding/updating SME
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    if (
      (profilePicture && !isEditMode) ||
      !name.trim() ||
      !email.trim() ||
      !department.trim() ||
      !bio.trim() ||
      !selectedExpertise.trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    if (profilePicture) {
      formData.append("profile_picture", profilePicture);
    } else if (isEditMode && isProfileRemoved) {
      formData.append("current_profile_url", DEFAULT_PROFILE_URL); // Remove profile picture
    } else if (selectedSME?.profile_url) {
      formData.append("current_profile_url", selectedSME.profile_url); // Retain existing picture
    }

    formData.append("name", name);
    formData.append("email", email);
    formData.append("department", department);
    formData.append("bio", bio);
    formData.append("expertise", selectedExpertise);
    formData.append("position", position);
    formData.append("entitas", entitas);
    coreCompetency.forEach((val) => formData.append("core_competency[]", val));

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
        setSuccessMessage(
          isEditMode ? "SME updated successfully!" : "SME added successfully!"
        );
        setIsSuccessModalOpen(true);
        resetForm();
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
    } finally {
      setIsLoading(false);
    }
  };

  // Filtering SME list based on search query and filters
  const filteredSMEs = useMemo(() => {
    if (!Array.isArray(smeList)) return [];

    return smeList.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.expertise.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesExpertise =
        selectedAreaOfExpertise === "Area of Expertise" ||
        item.expertise === selectedAreaOfExpertise;

      const matchesCoreCompetency =
        selectedCoreCompetency === "Core Competency" ||
        item.core_competency.includes(selectedCoreCompetency);

      return matchesSearch && matchesExpertise && matchesCoreCompetency;
    });
  }, [smeList, searchQuery, selectedAreaOfExpertise, selectedCoreCompetency]);

  return (
    <div className="pt-[16px]">
      {role === "KMI" && (
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      )}

      <SearchFilterBar
        selectedAreaOfExpertise={selectedAreaOfExpertise}
        setSelectedAreaOfExpertise={setSelectedAreaOfExpertise}
        isOpenAreaOfExpertise={isOpenAreaOfExpertise}
        setIsOpenAreaOfExpertise={setIsOpenAreaOfExpertise}
        selectedSBU={selectedCoreCompetency} // sebelumnya selectedSBU
        setSelectedSBU={setSelectedCoreCompetency}
        isOpenSBU={isOpenCoreCompetency}
        setIsOpenSBU={setIsOpenCoreCompetency}
        AreaOfExpertiseOptions={AreaOfExpertiseOptions}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isOverview={activeTab === "overview"}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        CoreCompetencyOptions={CoreCompetencyOptions}
      />

      <br />

      {activeTab === "overview" ? (
        filteredSMEs.length === 0 ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-center text-gray-500">No expert added</p>
          </div>
        ) : (
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
                  expertise={sme.expertise}
                  core_competency={sme.core_competency}
                />
              </div>
            ))}
          </div>
        )
      ) : (
        <>
          <form onSubmit={handleSubmit} className="flex gap-[50px]">
            <div className="h-[210px] w-[210px] flex justify-center items-start">
              <div
                className="w-[210px] h-[210px] rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-4xl cursor-pointer relative overflow-hidden"
                onClick={() =>
                  document.getElementById("profile-upload")?.click()
                }
              >
                <Image
                  src={previewUrl || DEFAULT_PROFILE_URL}
                  alt="Preview"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePicChange}
                />
                {isEditMode && (
                  <button
                    type="button"
                    className="absolute bottom-2 right-2 text-xs bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => {
                      setProfilePicture(null);
                      setPreviewUrl(null);
                      setIsProfileRemoved(true);
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

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
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-[12px] text-black"
                  >
                    <option value="">Select Department</option>
                    {DepartmentOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-[20px] mt-6">
                {/* LEFT: 2/3 */}
                <div className="md:col-span-2 flex flex-col gap-6">
                  <div className="grid md:grid-cols-2 gap-[20px]">
                    <div>
                      <label className="text-[18px] font-medium text-black">
                        Position
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 mt-[12px] text-black"
                        placeholder="Enter position"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[18px] font-medium text-black">
                        Entitas
                      </label>
                      <select
                        value={entitas}
                        onChange={(e) => setEntitas(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 mt-[12px] text-black"
                      >
                        <option value="">Select Entitas</option>
                        {EntitasOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-[20px]">
                    <div>
                      <label className="text-[18px] font-medium text-black">
                        Bio
                      </label>
                      <textarea
                        className="w-full border border-gray-300 rounded-md mt-[12px] px-3 py-2 h-[100px] text-black"
                        placeholder="Enter bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                      />
                    </div>

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
                  </div>
                </div>

                {/* RIGHT: 1/3 */}
                <div>
                  <label className="text-[18px] font-medium text-black">
                    Core Competency
                  </label>
                  <div className="flex flex-wrap gap-2 mt-[12px]">
                    {CoreCompetencyOptions.map((item) => {
                      const isSelected = coreCompetency.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() =>
                            setCoreCompetency((prev) =>
                              isSelected
                                ? prev.filter((val) => val !== item)
                                : [...prev, item]
                            )
                          }
                          className={`rounded-[4px] px-[6px] py-[3px] text-[14px] font-semibold border ${
                            isSelected
                              ? "bg-[#3A40D4] text-white border-[#3A40D4]"
                              : "text-[#7F7F7F] border-[#c3c3c3] hover:bg-gray-100"
                          }`}
                        >
                          + {item}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-end mt-4">
                    <button
                      type="submit"
                      className="bg-[#3A40D4] text-white px-6 py-2 rounded-[8px] text-[16px] transition w-[115px] h-[41px]"
                      disabled={isLoading}
                    >
                      {isLoading
                        ? isEditMode
                          ? "Updating..."
                          : "Uploading..."
                        : isEditMode
                        ? "Update"
                        : "Add"}
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
            selectedCoreCompetency={selectedCoreCompetency}
            searchQuery={searchQuery}
            onDelete={async (id) => {
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
              setBio(sme.bio);
              setSelectedExpertise(sme.expertise);
              setPreviewUrl(sme.profile_url);
              setDepartment(sme.department);
              setPosition(sme.position);
              setEntitas(sme.entitas);
              setCoreCompetency(sme.core_competency);
              setProfilePicture(null);
              setIsEditMode(true);
              setIsProfileRemoved(false);
              setActiveTab("add");
            }}
          />
        </>
      )}

      <SMEDetailModal
        isOpen={isDetailOpen}
        expert={selectedSME} // Pass expert data here
        onClose={() => {
          setSelectedSME(null);
          setIsDetailOpen(false);
        }}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        closeModal={() => setIsSuccessModalOpen(false)}
        message={successMessage}
      />
    </div>
  );
}

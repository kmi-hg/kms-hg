"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import SuccessModal from "./SuccessModal"; // Import SuccessModal

const Modal = ({
  isOpen,
  closeModal,
  file,
  isEditMode = false,
  initialData,
}: {
  isOpen: boolean;
  closeModal: () => void;
  file: File | null;
  isEditMode?: boolean;
  initialData?: {
    id: number;
    name: string;
    field: string;
    tags?: string;
    type: "pdf" | "mp3";
    path: string;
  };
}) => {
  const categories = ["Training", "Hasnur Talks", "Hasnur Weekly Insight"];
  const fieldOptions = [
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

  const [selectedCategory, setSelectedCategory] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [field, setField] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(file);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // Manage success modal state
  const [successMessage, setSuccessMessage] = useState(""); // Manage success message

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false); // Manage upload in progress state

  useEffect(() => {
    if (initialData) {
      setDocumentName(initialData.name);
      setField(initialData.field);
      setSelectedCategory(initialData.tags || "");
    }
    setUploadedFile(file);
  }, [file, initialData]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBrowseClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (selected) {
      const isPDF = selected.type === "application/pdf";
      const isMP3 = selected.type === "audio/mpeg";

      if (isPDF || isMP3) {
        setUploadedFile(selected);
        if (!isMP3) {
          setThumbnailFile(null);
        }
      } else {
        alert("Only PDF or MP3 files are allowed.");
      }
    }
  };

  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selected = event.target.files?.[0];
    if (selected && selected.type.startsWith("image/")) {
      setThumbnailFile(selected);
    } else {
      alert("Only image files are allowed for the thumbnail.");
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleUpload = async () => {
    if (!documentName || !field || !selectedCategory) {
      alert("Please fill all required fields.");
      return;
    }

    // Set uploading state to true
    setIsUploading(true);

    const formData = new FormData();
    formData.append("name", documentName);
    formData.append("field", field);
    formData.append("tags", selectedCategory);

    if (uploadedFile) {
      formData.append("file", uploadedFile);
    }

    if (uploadedFile?.type === "audio/mpeg" && thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    // Tambahkan ini juga saat EDIT dan ada thumbnail baru
    if (isEditMode && initialData?.type === "mp3" && thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    let method = "POST";

    if (isEditMode && initialData) {
      formData.append("id", initialData.id.toString());
      formData.append("type", initialData.type);
      formData.append("oldPath", initialData.path);
      method = "PUT";
    }

    try {
      const res = await fetch("/api/knowledge", {
        method,
        body: formData,
      });

      // Reset uploading state after fetching
      setIsUploading(false);

      if (res.ok) {
        // Reset form fields
        setDocumentName("");
        setField("");
        setSelectedCategory("");
        setUploadedFile(null);
        setThumbnailFile(null);

        // Open SuccessModal
        setSuccessMessage(
          isEditMode ? "Update successful!" : "Upload successful!"
        );
        setIsSuccessModalOpen(true);
      } else {
        const err = await res.json();
        alert(`Upload failed: ${err.error || "unknown error"}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Unexpected error occurred.");
      setIsUploading(false); // Ensure uploading state is false if there's an error
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50 absolute"
        onClick={closeModal}
      ></div>

      <div
        className="relative bg-white w-[780px] max-h-[90vh] rounded-[20px] border border-[#E5E5E5] shadow-lg z-50 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-y-auto px-[35px] pt-[35px] pb-[20px] w-full flex-1">
          <div className="flex flex-col items-start mb-[30px]">
            <h1 className="text-[20px] font-bold text-black">
              {isEditMode ? "Edit knowledge" : "Add new knowledge"}
            </h1>
            <p className="text-[14px] text-[#7F7F7F] font-semibold">
              {isEditMode
                ? "You can update metadata or upload a new file."
                : "Drag and drop files to add a new knowledge."}
            </p>
          </div>

          <input
            type="file"
            accept=".pdf, .mp3"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <div
            className="bg-[#FCFBFC] border border-dashed border-[#CFCFCF] rounded-[4px] w-full h-[160px] mb-[30px] flex flex-col justify-center items-center px-4"
            onClick={handleBrowseClick}
          >
            <Image
              src="/upload_icon.png"
              alt="upload"
              className="mb-2"
              width={27}
              height={33}
            />
            <div className="w-[240px] text-center flex flex-col items-center justify-center px-4">
              <p className="text-[15px] text-[#7A7A7A] font-medium">
                Drop your knowledge here, or{" "}
                <span className="text-[#3A40D4] font-medium cursor-pointer">
                  click to browse
                </span>
              </p>
              {uploadedFile ? (
                <p className="mt-2 text-sm text-green-600 font-medium">
                  File selected: {uploadedFile.name}
                </p>
              ) : isEditMode && initialData ? (
                <p className="mt-2 text-sm text-blue-600 font-medium">
                  Existing file: {initialData.name.split("/").pop()}
                </p>
              ) : null}
            </div>
          </div>

          {(uploadedFile?.type === "audio/mpeg" ||
            (isEditMode && initialData?.type === "mp3")) && (
            <div className="mb-[30px]">
              <label className="text-[16px] font-semibold text-black mb-[10px] block">
                Upload Thumbnail
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="block text-sm text-black"
              />
              {thumbnailFile && (
                <p className="mt-2 text-sm text-green-600 font-medium">
                  Thumbnail selected: {thumbnailFile.name}
                </p>
              )}
            </div>
          )}

          <div className="flex w-full justify-between gap-[20px] mb-[30px]">
            <div className="flex flex-col w-full items-start">
              <label className="text-[16px] font-semibold text-black mb-[10px]">
                Document Name
              </label>
              <input
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                className="w-full border border-[#D9D9D9] rounded-md h-[38px] px-3 text-sm text-black"
              />
            </div>
            <div className="flex flex-col w-full items-start">
              <label className="text-[16px] font-semibold text-black mb-[10px]">
                Fields
              </label>
              <select
                value={field}
                onChange={(e) => setField(e.target.value)}
                className="w-full border border-[#D9D9D9] rounded-md h-[38px] px-3 text-sm text-black"
              >
                <option value="" disabled>
                  Select a field
                </option>
                {fieldOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col items-start mb-[30px]">
            <label className="text-[16px] font-semibold text-black mb-[12px]">
              Categories
            </label>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <span
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`w-fit h-fit py-[3px] px-[6px] border rounded-[4px] text-[14px] cursor-pointer ${
                    selectedCategory === category
                      ? "bg-[#3A40D4] text-white border-blue-500"
                      : "border-[#D9D9D9] text-[#7F7F7F] hover:bg-gray-100"
                  }`}
                >
                  + {category}
                </span>
              ))}
            </div>
            {selectedCategory && (
              <p className="mt-2 text-sm text-gray-700">
                Selected category: <strong>{selectedCategory}</strong>
              </p>
            )}
          </div>
        </div>

        <div className="w-full flex items-center justify-end border-t border-[#E5E5E5] px-[35px] py-[15px]">
          <button
            onClick={handleUpload}
            className="w-[115px] h-[41px] bg-[#3D5AFE] text-white px-6 py-2 rounded-[8px] text-[16px] font-semibold hover:bg-[#2c47e3] transition-all"
            disabled={isUploading} // Disable the button while uploading
          >
            {isUploading ? "Uploading..." : isEditMode ? "Update" : "Upload"}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        closeModal={() => setIsSuccessModalOpen(false)} // Close SuccessModal
        closeKnowledgeModal={closeModal} // Close KnowledgeModal when SuccessModal is closed
        message={successMessage}
      />
    </div>
  );
};

export default Modal;

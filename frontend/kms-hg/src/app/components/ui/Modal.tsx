"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

const Modal = ({
  isOpen,
  closeModal,
  file,
}: {
  isOpen: boolean;
  closeModal: () => void;
  file: File | null;
}) => {
  const categories = ["Training", "Hasnur Talks", "Hasnur Weekly Insight"];

  const [selectedCategory, setSelectedCategory] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [field, setField] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(file);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    setUploadedFile(file);
  }, [file]);

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
        console.log("Modal - selected file:", selected.name);
      } else {
        alert("Only PDF or MP3 files are allowed.");
      }
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleUpload = async () => {
    if (!uploadedFile || !documentName || !field || !selectedCategory) {
      alert("Please fill all fields before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("name", documentName);
    formData.append("field", field);
    formData.append("tags", selectedCategory);

    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Upload successful!");
        closeModal();
        // Optional: reset form
        setDocumentName("");
        setField("");
        setSelectedCategory("");
        setUploadedFile(null);
      } else {
        const err = await res.json();
        alert(`Upload failed: ${err.error || "unknown error"}`);
      }
    } catch (error) {
      alert("An unexpected error occurred.");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50 absolute"
        onClick={closeModal}
      ></div>

      <div
        className="relative bg-white w-[780px] h-[585px] rounded-[20px] border border-[#E5E5E5] shadow-lg z-50 flex flex-col items-start"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-[35px] pt-[35px] w-full">
          <div className="flex flex-col items-start mb-[30px]">
            <h1 className="text-[20px] font-bold text-black">
              Add new knowledge
            </h1>
            <p className="text-[14px] text-[#7F7F7F] font-semibold">
              Drag and drop files to add a new knowledge.
            </p>
          </div>

          <input
            type="file"
            accept=".pdf, .mp3"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <div className="bg-[#FCFBFC] border border-dashed border-[#CFCFCF] rounded-[4px] w-full h-[160px] mb-[30px] flex flex-col justify-center items-center px-4">
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
                <span
                  className="text-[14px] text-[#3A40D4] font-medium cursor-pointer"
                  onClick={handleBrowseClick}
                >
                  click to browse
                </span>
              </p>
              {uploadedFile && (
                <p className="mt-2 text-sm text-green-600 font-medium">
                  Uploaded file: {uploadedFile.name}
                </p>
              )}
            </div>
          </div>

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

        <div className="w-full h-full flex items-center justify-end border-t border-[#E5E5E5] pr-[35px]">
          <button
            onClick={handleUpload}
            className="w-[115px] h-[41px] bg-[#3D5AFE] text-white px-6 py-2 rounded-[8px] text-[16px] font-semibold hover:bg-[#2c47e3] transition-all"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

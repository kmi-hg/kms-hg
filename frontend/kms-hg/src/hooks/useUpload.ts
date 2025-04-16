import { useRef, useState } from "react";

export function useUpload() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [droppedFile, setDroppedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setDroppedFile(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === "application/pdf" || file.type === "audio/mpeg")) {
      setDroppedFile(file);
      openModal();
    } else {
      alert("Only PDF or MP3 files are allowed.");
    }
  };
  
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (file.type === "application/pdf" || file.type === "audio/mpeg")) {
      setDroppedFile(file);
      openModal();
    } else {
      alert("Only PDF or MP3 files are allowed.");
    }
  };
  

  return {
    fileInputRef,
    droppedFile,
    isModalOpen,
    openModal,
    closeModal,
    handleFileChange,
    handleDrop,
  };
}

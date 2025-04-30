import React from "react";
import Image from "next/image"; // Importing the Next.js Image component

type DeleteConfirmationModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  onDelete: () => void;
  itemName: string;
};

const DeleteConfirmationModal = ({
  isOpen,
  closeModal,
  onDelete,
  itemName,
}: DeleteConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50 absolute" />
      <div className="relative bg-white p-[24px] rounded-[16px] shadow-lg w-[400px] h-fit z-50">
        <Image
          src="/delete_logo.png"
          alt="Delete"
          className="h-[48px] w-[48px]"
          width={48} // You can specify the width and height explicitly for Image component
          height={48}
        />
        <br />
        <h2 className="text-black text-[18px] font-semibold">
          Delete {itemName}
        </h2>
        <h2 className="text-[#535862] text-[14px] font-regular mb-[30px] mt-[6px]">
          Are you sure you want to delete this knowledge? This action cannot be
          undone.{" "}
        </h2>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={closeModal}
            className="w-full px-4 py-2 bg-white border border-[#D5D7DA] text-[16px] text-[#414651] font-semibold rounded-[8px]"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="w-full px-4 py-[10px] bg-[#D92D20] text-[16px] text-white font-semibold rounded-[8px]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;

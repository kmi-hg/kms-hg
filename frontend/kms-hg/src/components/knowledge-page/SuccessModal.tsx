import React from "react";
import Image from "next/image"; // Importing the Next.js Image component

type SuccessModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  message: string; // Success message to display
};

const SuccessModal = ({
  isOpen,
  closeModal,
  message,
  closeKnowledgeModal,
}: SuccessModalProps & { closeKnowledgeModal: () => void }) => {
  if (!isOpen) return null; // If modal isn't open, return nothing

  const handleClose = () => {
    closeModal(); // Close SuccessModal first
    closeKnowledgeModal(); // Close KnowledgeModal after SuccessModal closes
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50 absolute" />
      <div className="relative bg-white p-[24px] rounded-[16px] shadow-lg w-[400px] h-fit z-[61]">
        <Image
          src="/success_icon.png"
          alt="Success"
          className="h-[48px] w-[48px]"
          width={48}
          height={48}
        />
        <h2 className="text-black text-[18px] font-semibold">Success</h2>
        <h2 className="text-[#535862] text-[14px] font-regular mb-[30px] mt-[6px]">
          {message}
        </h2>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handleClose} // Close both modals
            className="w-full px-4 py-2 bg-white border border-[#D5D7DA] text-[16px] text-[#414651] font-semibold rounded-[8px]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;

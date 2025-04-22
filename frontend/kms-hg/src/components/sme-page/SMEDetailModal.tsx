// components/sme-page/SMEDetailModal.tsx
import React from "react";

interface SME {
  name: string;
  email: string;
  sbu: string;
  profile_url: string;
  area_of_expertise: string;
  bio: string;
}

interface SMEDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  sme: SME | null;
}

export default function SMEDetailModal({
  isOpen,
  onClose,
  sme,
}: SMEDetailModalProps) {
  if (!isOpen || !sme) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50 absolute z-50"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-[16px] w-full max-w-[649px] max-h-[800px] px-[41px] py-[35px] shadow-lg z-50">
        <button
          className="absolute top-4 right-4 text-gray-500"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="flex gap-6">
          <div className="flex-shrink-0 w-[300px] h-[300px] border border-[#9C9C9C] rounded-full overflow-hidden">
            <img
              src={sme.profile_url}
              alt={sme.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-start gap-[20px]">
            <div>
              <p className="text-[18px] text-black font-bold">Name</p>
              <p className="text-[16px] text-[#4E4E4E] font-reguler">
                {sme.name}
              </p>
            </div>
            <div>
              <p className="text-[18px] text-black font-bold">SBU</p>
              <p className="text-[16px] text-[#4E4E4E] font-reguler">
                {sme.sbu}
              </p>
            </div>
            <div>
              <p className="text-[18px] text-black font-bold">
                Area of Expertise
              </p>
              <p className="text-[16px] text-[#4E4E4E] font-reguler">
                {sme.area_of_expertise}
              </p>
            </div>
            <div>
              <p className="text-[18px] text-black font-bold">Email</p>
              <a
                href={`mailto:${sme.email}`}
                className="text-[16px] text-[#4E4E4E] font-reguler underline "
              >
                {sme.email}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-[18px] text-black font-bold">Bio</p>
          <p className="text-[16px] text-[#4E4E4E] font-reguler">{sme.bio}</p>
        </div>

        <div className="mt-6">
          <button
            onClick={() => window.open(`mailto:${sme.email}`, "_blank")}
            className="w-full h-[41px] bg-[#3A40D4] text-white px-6 py-2 rounded-lg text-[18px] font-semibold hover:bg-blue-700 transition"
          >
            Contact Expert
          </button>
        </div>
      </div>
    </div>
  );
}

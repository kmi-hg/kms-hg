import React, { useState } from "react";
import Image from "next/image"; 

interface Expert {
  id: number;
  name: string;
  email: string;
  profile_url: string;
  department: string; 
  entitas: string; 
  expertise: string;
  core_competency: string[]; 
  bio: string;
}

interface SMEDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  expert: Expert | null;
}

export default function SMEDetailModal({
  isOpen,
  onClose,
  expert,
}: SMEDetailModalProps) {
  const [previewUrl] = useState<string | null>(null);
  const DEFAULT_PROFILE_URL = "/default-profile-picture.png";

  if (!isOpen || !expert) return null;

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
            <Image
              src={previewUrl || DEFAULT_PROFILE_URL}
              alt={expert.name}
              className="w-full h-full object-cover"
              width={300} // Added width and height for Next.js Image optimization
              height={300}
            />
          </div>
          <div className="flex flex-col justify-start gap-[20px]">
            <div>
              <p className="text-[18px] text-black font-bold">Name</p>
              <p className="text-[16px] text-[#4E4E4E] font-reguler">
                {expert.name}
              </p>
            </div>
            <div>
              <p className="text-[18px] text-black font-bold">Expertise</p>
              <p className="text-[16px] text-[#4E4E4E] font-reguler">
                {expert.expertise}
              </p>
            </div>
            <div>
              <p className="text-[18px] text-black font-bold">
                Core Competency
              </p>
              <ul className="text-[16px] text-[#4E4E4E] font-reguler">
                {expert.core_competency.map((competency, index) => (
                  <li key={index}>{competency}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[18px] text-black font-bold">Email</p>
              <a
                href={`mailto:${expert.email}`}
                className="text-[16px] text-[#4E4E4E] font-reguler underline "
              >
                {expert.email}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-[18px] text-black font-bold">Bio</p>
          <p className="text-[16px] text-[#4E4E4E] font-reguler">
            {expert.bio}
          </p>
        </div>

        <div className="mt-6">
          <button
            onClick={() => window.open(`mailto:${expert.email}`, "_blank")}
            className="w-full h-[41px] bg-[#3A40D4] text-white px-6 py-2 rounded-lg text-[18px] font-semibold hover:bg-blue-700 transition"
          >
            Contact Expert
          </button>
        </div>
      </div>
    </div>
  );
}

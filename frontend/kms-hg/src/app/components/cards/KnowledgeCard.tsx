import { KnowledgeItem } from "@/types";
import Image from "next/image";

export default function KnowledgeCard({ item }: { item: KnowledgeItem }) {
  const handleDoubleClick = () => {
    if (item.path) {
      window.open(item.path, "_blank");
    }
  };

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className="flex flex-col justify-between cursor-pointer w-full bg-white rounded-[10px] border border-[#c2c2c2] shadow-[0px_1px_31.1px_-10px_rgba(0,0,0,0.25)] mt-[30px] pt-[25px] pb-[13px] mx-auto"
    >
      {/* Header */}
      <div className="w-full flex justify-between px-[18px] mb-[10px]">
        <div className="max-w-[230px] flex items-start">
          <p
            className="text-[18px] font-figtree font-semibold text-gray-900 leading-tight overflow-hidden text-ellipsis line-clamp-2"
            title={item.name}
          >
            {item.name}
          </p>
        </div>
        {/* <div className="h-[27px] w-[27px] bg-[#f7f7f7] rounded-[7px]"></div> */}
      </div>

      {/* File Info */}
      <div className="flex items-center mr-[8px] mb-[20px] mt-[10px] px-[18px] gap-2">
        <div className="w-[17px] h-[14px] bg-[#57A5A0]"></div>
        <p className="text-[14px] font-figtree text-gray-500">
          {item.field} • {item.size.toFixed(2)} MB
        </p>
      </div>

      <hr className="w-full border-t border-gray-300" />

      {/* Gambar tengah */}
      <div className="w-full flex items-center justify-center px-[18px] mt-[25px] mb-[25px]">
        <div className="relative w-full max-w-[100%] h-[162px]">
          <Image
            src="/cth-knowledge.png"
            alt="Hasnur Group"
            fill
            className="object-contain"
            sizes="100vw"
          />
        </div>
      </div>

      <hr className="w-full border-t border-gray-300" />

      {/* Footer */}
      <div className="flex w-full items-center justify-between mt-[15px] px-[18px]">
        <p className="text-[12px] font-figtree text-gray-500">
          {item.tags} •{" "}
          {new Date(item.uploadedAt).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })}
        </p>
        <div className="w-[17px] h-[14px] bg-[#57A5A0]"></div>
      </div>
    </div>
  );
}

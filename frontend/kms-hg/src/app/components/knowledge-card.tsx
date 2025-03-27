export default function KnowledgeCard() {
  return (
    <div className="w-full bg-white rounded-[10px] border border-[#c2c2c2] shadow-[0px_1px_31.1px_-10px_rgba(0,0,0,0.25)] mt-[30px] pt-[25px] pb-[13px] mx-auto">
      {/* Header */}
      <div className="w-full flex justify-between px-[18px]">
        <div className="max-w-[230px]">
          <p className="text-[18px] font-figtree font-semibold text-gray-900 leading-tight">
            SOPEP (Shipboard Oil Pollution Emergency Plan)
          </p>
        </div>
        <div className="h-[27px] w-[27px] bg-[#f7f7f7] rounded-[7px]"></div>
      </div>

      {/* File Info */}
      <div className="flex items-center mr-[8px] mb-[20px] mt-[10px] px-[18px] gap-2">
        <div className="w-[17px] h-[14px] bg-[#57A5A0]"></div>
        <p className="text-[14px] font-figtree text-gray-500">Mei 31, 2022 • 2.3 MB</p>
      </div>

      <hr className="w-full border-t border-gray-300" />

      {/* Gambar tengah */}
      <div className="w-full flex items-center justify-center px-[18px] mt-[25px] mb-[25px]">
        <img
          src="cth-knowledge.png"
          alt="Hasnur Group"
          className="w-full h-auto max-h-[162px] object-contain"
        />
      </div>

      <hr className="w-full border-t border-gray-300" />

      {/* Footer */}
      <div className="flex w-full items-center justify-between mt-[15px] px-[18px]">
        <p className="text-[14px] font-figtree text-gray-500">Mei 31, 2022 • 2.3 MB</p>
        <div className="w-[17px] h-[14px] bg-[#57A5A0]"></div>
      </div>
    </div>
  );
}

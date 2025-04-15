import Image from 'next/image'

export default function RecentlyOpenedCard() {
  return (
    <div className=" w:full bg-white rounded-lg border border-gray-300 flex items-center gap-4 p-4 shadow-sm">
      {/* Thumbnail Image */}
      <div className="min-w-[80px] h-[80px] sm:h-[95px] sm:w-[95px] rounded-md overflow-hidden bg-gray-200 flex items-center justify-center">
        <Image
          src="/cth-knowledge.png"
          alt="SOPEP Document"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Text Content */}
      <div className="flex flex-col justify-between">
        <h3 className="text-[16px] font-figtree font-semibold text-gray-900 leading-tight line-clamp-2">
          SOPEP (Shipboard Oil Pollution Emergency Plan)
        </h3>
        <p className="text-[14px] font-figtree text-gray-500 mt-1">
          Mei 31, 2022 • 2.3 MB
        </p>
      </div>
    </div>
  );
}

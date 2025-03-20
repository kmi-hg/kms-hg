export default function RecentlyOpenedCard() {
  return (
    <div className="lg:w-[325px] xl:w-full lg:h-[137px] bg-white rounded-lg border border-gray-300 flex items-center justify-between py-[21px] px-[21px] shadow-sm">
      {/* Thumbnail Image */}
      <div className="h-[95px] w-[95px] rounded-md overflow-hidden bg-gray-200 flex items-center justify-center">
        <img
          src="/your-image-path.png"
          alt="SOPEP Document"
          className="object-cover"
        />
      </div>

      {/* Text Content */}
      <div className="flex flex-col w-[170px] h-[77px] justify-between">
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

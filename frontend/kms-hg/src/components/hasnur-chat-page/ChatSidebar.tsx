import Link from "next/link";

const ChatSidebar = () => {
  return (
    <div className="w-64 bg-white border-r p-4 overflow-y-auto">
      <div className="mb-4">
        <Link href="/knowledge">
          <img
            src="/logo-hasnur-ai.png"
            alt="Hasnur AI Logo"
            className="h-8 cursor-pointer"
          />
        </Link>
      </div>

      <div>
        <h3 className="text-gray-600 text-sm font-semibold mb-2">Today</h3>
        <ul className="space-y-1 text-sm">
          <li className="text-blue-600 font-medium cursor-pointer">
            Cara meningkatkan efisiensi produksi tambang
          </li>
          <li className="cursor-pointer">Bagaimana menjadi pekerja tambang</li>
          <li className="cursor-pointer">Prosedur keselamatan kerja</li>
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="text-gray-600 text-sm font-semibold mb-2">
          Previous 7 Days
        </h3>
        <ul className="space-y-1 text-sm">
          <li className="cursor-pointer">Jenis-jenis alat berat</li>
          <li className="cursor-pointer">Teknik pengeboran eksplorasi</li>
        </ul>
      </div>
    </div>
  );
};

export default ChatSidebar;

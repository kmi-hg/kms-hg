"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const ChatSidebar = () => {
  const router = useRouter();

  const handleCreateRoom = async () => {
    try {
      const res = await fetch("/api/chat/room", { method: "POST" });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server Error: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      if (data.userId) {
        router.push(`/hasnur-chat?userId=${data.userId}`);
      }
    } catch (err) {
      console.error("❌ Failed to create room:", err);
    }
  };

  return (
    <div className="w-64 bg-white border-r p-4 overflow-y-auto">
      {/* Logo */}
      <div className="mb-4">
        <Link href="/knowledge">
          <img
            src="/logo-hasnur-ai.png"
            alt="Hasnur AI Logo"
            className="h-8 cursor-pointer"
          />
        </Link>
      </div>

      {/* Tombol Buat Room Baru */}
      <button
        onClick={handleCreateRoom}
        className="w-full mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md"
      >
        + Buat Chat Room Baru
      </button>

      {/* Daftar Chat Hari Ini */}
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

      {/* Daftar Chat Sebelumnya */}
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

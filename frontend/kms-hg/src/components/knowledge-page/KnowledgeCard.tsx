"use client";

import { KnowledgeItem } from "@/types/knowledgeItem";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function KnowledgeCard({ item }: { item: KnowledgeItem }) {
  const router = useRouter();
  const { data: session } = useSession();

  const handleDoubleClick = () => {
    if (!session) {
      console.error("User is not logged in");
      return;
    }

    const userId = session.user.id;

    if (item.path && item.path.toLowerCase().trim().endsWith(".mp3")) {
      const track = {
        title: item.name,
        artist: "Unknown Artist",
        src: item.path,
        thumbnail: item.thumbnailPath || "cth-knowledge.png",
      };
      localStorage.setItem("selectedTrack", JSON.stringify(track));

      const slug = item.name
        .toLowerCase()
        .replace(/\.[^/.]+$/, "")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "");

      router.push(`/knowledge/${slug}`);
    } else if (item.path) {
      window.open(item.path, "_blank");
    }

    fetch("/api/recently-opened-files", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileId: item.id,
        userId: userId,
      }),
    }).catch((error) => {
      console.error("Error adding to recently opened:", error);
    });

    fetch("/api/document-views", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        documentId: item.id,
      }),
    }).catch((error) => {
      console.error("Error adding document view:", error);
    });
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
      </div>

      {/* File Info */}
      <div className="flex items-center mr-[8px] mb-[20px] mt-[10px] px-[18px] gap-2">
        <div className="px-[6px] py-[2px] bg-[#57A5A0] text-white text-[10px] font-semibold rounded">
          {item.path.split(".").pop()?.toUpperCase()}
        </div>
        <p className="text-[14px] font-figtree text-gray-500">
          {item.field} • {item.size.toFixed(2)} MB
        </p>
      </div>

      <hr className="w-full border-t border-gray-300" />

      {/* Image preview (thumbnail or default) */}
      <div className="w-full px-[18px] mt-[25px] mb-[25px]">
        <div className="relative w-full h-[160px]">
          <Image
            src={item.thumbnailPath || "/cth-knowledge.png"}
            alt={item.name}
            fill
            className="object-cover rounded-[6px]"
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
        {/* <div className="w-[17px] h-[14px] bg-[#57A5A0]"></div> */}
      </div>
    </div>
  );
}

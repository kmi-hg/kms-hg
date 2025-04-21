"use client";

import { useEffect, useState } from "react";
import { KnowledgeCard } from "@/app";
import type { KnowledgeItem } from "@/types";

export default function KnowledgeList() {
  const [data, setData] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/knowledge")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data);
        setData(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-[200px]">
        <p className="text-gray-400 text-sm font-figtree">Loading...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-[200px]">
        <p className="text-gray-400 text-sm font-figtree">No file added</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 lg:gap-[17px]">
      {data.map((item) => (
        <KnowledgeCard key={item.id} item={item} />
      ))}
    </div>
  );
}

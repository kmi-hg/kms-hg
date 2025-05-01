"use client";

import { useEffect, useState } from "react";
import { KnowledgeCard } from "@/app";
import type { KnowledgeItem } from "@/types";

type KnowledgeListProps = {
  searchQuery: string;
  selectedField: string;
  selectedType: string;
};

export default function KnowledgeList({
  searchQuery,
  selectedField,
  selectedType,
}: KnowledgeListProps) {
  const [data, setData] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/knowledge")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setData(data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setData([]);
        setLoading(false);
      });
  }, []);

  const filteredData = data
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesField =
        selectedField === "Fields" || item.field === selectedField;
      const matchesType =
        selectedType === "Type" ||
        item.type.toUpperCase() === selectedType.toUpperCase();

      return matchesSearch && matchesField && matchesType;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-[200px]">
        <p className="text-gray-400 text-sm font-figtree">Loading...</p>
      </div>
    );
  }

  if (filteredData.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-[200px]">
        <p className="text-gray-400 text-sm font-figtree">
          No files match your search or filter
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 lg:gap-[17px]">
      {filteredData.map((item) => (
        <KnowledgeCard key={item.id} item={item} />
      ))}
    </div>
  );
}

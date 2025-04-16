"use client";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { KnowledgeItem } from "@/types";

export default function KnowledgeTable() {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKnowledge = async () => {
      try {
        const res = await fetch("/api/knowledge");
        const data: KnowledgeItem[] = await res.json();

        // Sort by newest uploadedAt
        const sortedData = data.sort(
          (a, b) =>
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );

        setKnowledgeItems(sortedData);
      } catch (err) {
        console.error("Failed to fetch knowledge items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledge();
  }, []);

  if (loading) {
    return <p className="text-gray-500 text-sm px-4 py-2">Loading...</p>;
  }

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full text-left text-[16px] text-gray-600">
        <thead className="bg-[#FAFAFA] text-[#222] font-semibold">
          <tr>
            <th className="px-4 py-3">Document Name</th>
            <th className="px-4 py-3">Document Type</th>
            <th className="px-4 py-3">Categories</th>
            <th className="px-4 py-3">Fields</th>
            <th className="px-4 py-3">Click Rate</th>
            <th className="px-4 py-3">Document Date</th>
            <th className="px-4 py-3">Operation Selected</th>
          </tr>
        </thead>
        <tbody>
          {knowledgeItems.map((doc, index) => (
            <tr key={index} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap truncate max-w-[300px]">
                {doc.name}
              </td>
              <td className="px-4 py-3 flex justify-center">
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-[16px]">
                  {doc.type.toUpperCase()}
                </span>
              </td>
              <td className="px-4 py-3">{doc.tags}</td>
              <td className="px-4 py-3">
                <span className="bg-gray-100 text-gray-70 px-2 py-1 rounded text-[16px]">
                  {doc.field}
                </span>
              </td>
              {/* TODO: {doc.clickRate ?? 0} */}
              <td className="text-center px-4 py-3">24</td>{" "}
              <td className="px-4 py-3">
                {new Date(doc.uploadedAt).toLocaleString("id-ID", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td className="px-4 py-3 flex flex-row gap-[5px] justify-between">
                <button className="w-full h-[24px] radius-[4px] border border-[#EAECEB] text-gray-600 hover:text-blue-500 flex justify-center items-center">
                  <FaEdit />
                </button>
                <button className="w-full h-[24px] radius-[4px] border border-[#EAECEB] text-gray-600 hover:text-blue-500 flex justify-center items-center">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

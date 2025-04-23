"use client";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { KnowledgeItem } from "@/types";
import Modal from "@/components/knowledge-page/KnowledgeModal";

export default function KnowledgeTable() {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<KnowledgeItem | null>(null);

  useEffect(() => {
    const fetchKnowledge = async () => {
      try {
        const res = await fetch("/api/knowledge");
        const data: KnowledgeItem[] = await res.json();

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

  const handleDelete = async (
    id: number,
    path: string,
    type: "pdf" | "mp3"
  ) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirm) return;

    try {
      const res = await fetch("/api/knowledge", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, path, type }),
      });

      if (res.ok) {
        setKnowledgeItems((prev) => prev.filter((item) => item.id !== id));
      } else {
        const err = await res.json();
        alert(`Failed to delete: ${err.error}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Unexpected error occurred.");
    }
  };

  if (loading) {
    return <p className="text-gray-500 text-sm px-4 py-2">Loading...</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg">
      <table className="min-w-full table-fixed text-[16px] text-gray-600">
        <thead className="bg-white text-[#222] font-semibold">
          <tr>
            <th className="px-4 py-3 font-semibold text-left">Document Name</th>
            <th className="px-4 py-3 font-semibold text-center">
              Document Type
            </th>
            <th className="px-4 py-3 font-semibold text-center">Categories</th>
            <th className="px-4 py-3 font-semibold text-center">Fields</th>
            <th className="px-4 py-3 font-semibold text-center">Click Rate</th>
            <th className="px-4 py-3 font-semibold text-center">
              Document Date
            </th>
            <th className="px-4 py-3 font-semibold text-center">
              Operation Selected
            </th>
          </tr>
        </thead>

        <tbody>
          {knowledgeItems.map((doc, index) => (
            <tr
              key={doc.id}
              className={index % 2 === 0 ? "bg-[#FCFBFC]" : "bg-white"}
            >
              <td className="relative px-4 py-3 whitespace-nowrap truncate max-w-[300px] text-[#85878B] group cursor-pointer">
                {doc.name}
                <div className="absolute z-50 hidden group-hover:block bg-white text-[#222] text-sm px-3 py-2 rounded-md shadow-lg border border-gray-200 w-max max-w-[300px] left-1/2 -translate-x-1/2 top-full mt-1">
                  {doc.name}
                </div>
              </td>

              <td className="px-4 py-3 text-center">
                <span className="bg-gray-100 text-[#85878B] px-2 py-1 rounded text-[14px]">
                  {doc.type.toUpperCase()}
                </span>
              </td>
              <td className="px-4 py-3 text-[#85878B]">{doc.tags}</td>
              <td className="px-4 py-3">
                <span className="bg-gray-100 text-[#85878B] px-2 py-1 rounded text-[14px] text-center">
                  {doc.field}
                </span>
              </td>
              <td className="text-center px-4 py-3 text-[#85878B]">24</td>
              <td className="px-4 py-3 text-[#85878B]">
                {new Date(doc.uploadedAt).toLocaleString("id-ID", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td className="px-4 py-3 flex flex-row gap-[5px] justify-between">
                <button
                  onClick={() => {
                    setEditData(doc);
                    setEditModalOpen(true);
                  }}
                  className="w-full h-[24px] border border-[#EAECEB] rounded-[4px] text-gray-600 text-center items-center cursor-pointer flex justify-center"
                >
                  <img
                    src="/edit_icon.png"
                    alt="Edit"
                    className="h-[15px] w-[15px]"
                  />
                </button>
                <button
                  onClick={() => handleDelete(doc.id, doc.path, doc.type)}
                  className="w-full h-[24px] border border-[#EAECEB] rounded-[4px] text-gray-600 text-center items-center cursor-pointer flex justify-center"
                >
                  <img
                    src="/delete_icon.png"
                    alt="Delete"
                    className="h-[15px] w-[13px]"
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editModalOpen && editData && (
        <Modal
          isOpen={editModalOpen}
          closeModal={() => {
            setEditModalOpen(false);
            setEditData(null);
          }}
          file={null}
          isEditMode
          initialData={{
            id: editData.id,
            name: editData.name,
            field: editData.field,
            tags: editData.tags || "",
            type: editData.type,
            path: editData.path,
          }}
        />
      )}
    </div>
  );
}

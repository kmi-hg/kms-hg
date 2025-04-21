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
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full text-left text-[16px] text-gray-600">
        <thead className="bg-[#FAFAFA] text-[#222] font-semibold">
          <tr>
            <th className="px-4 py-3 font-semibold">Document Name</th>
            <th className="px-4 py-3 font-semibold">Document Type</th>
            <th className="px-4 py-3 font-semibold">Categories</th>
            <th className="px-4 py-3 font-semibold">Fields</th>
            <th className="px-4 py-3 font-semibold">Click Rate</th>
            <th className="px-4 py-3 font-semibold">Document Date</th>
            <th className="px-4 py-3 font-semibold">Operation Selected</th>
          </tr>
        </thead>
        <tbody>
          {knowledgeItems.map((doc) => (
            <tr key={doc.id} className="border-t">
              <td className="px-4 py-3 whitespace-nowrap truncate max-w-[300px] text-[#85878B]">
                {doc.name}
              </td>
              <td className="px-4 py-3 flex justify-center">
                <span className="bg-gray-100 text-[#85878B] px-2 py-1 rounded text-[14px]">
                  {doc.type.toUpperCase()}
                </span>
              </td>
              <td className="px-4 py-3 text-[#85878B]">{doc.tags}</td>
              <td className="px-4 py-3">
                <span className="bg-gray-100 text-[#85878B] px-2 py-1 rounded text-[14px]">
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
                  className="w-full h-[24px] border border-[#EAECEB] text-gray-600 flex justify-center items-center cursor-pointer"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(doc.id, doc.path, doc.type)}
                  className="w-full h-[24px] border border-[#EAECEB] text-gray-600 flex justify-center items-center cursor-pointer"
                >
                  <FaTrash />
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

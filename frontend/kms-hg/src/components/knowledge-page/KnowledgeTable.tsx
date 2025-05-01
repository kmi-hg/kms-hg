"use client";

import { useEffect, useState } from "react";
import { KnowledgeItem } from "@/types";
import Modal from "@/components/knowledge-page/KnowledgeModal";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import DeleteConfirmationModal from "../knowledge-page/DeleteConfirmationModal";
import Image from "next/image"; // Importing the Next.js Image component

type SortColumn = "name" | "clickRate" | null;
type SortDirection = "asc" | "desc";

type KnowledgeTableProps = {
  searchQuery: string;
  selectedFields: string;
  selectedType: string;
};

export default function KnowledgeTable({
  searchQuery,
  selectedFields,
  selectedType,
}: KnowledgeTableProps) {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<KnowledgeItem | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<KnowledgeItem | null>(null);

  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  useEffect(() => {
    const fetchKnowledge = async () => {
      try {
        const res = await fetch("/api/knowledge");
        let data: KnowledgeItem[] = await res.json();

        data = data.sort(
          (a, b) =>
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );

        setKnowledgeItems(data);
      } catch (err) {
        console.error("Failed to fetch knowledge items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledge();
  }, []);

  useEffect(() => {
    const fetchKnowledge = async () => {
      try {
        const res = await fetch("/api/knowledge");
        let data: KnowledgeItem[] = await res.json();

        // Fetch the click rates for each document
        for (let i = 0; i < data.length; i++) {
          const resViews = await fetch(
            `/api/document-views?documentId=${data[i].id}`
          );

          // Get the response text and parse it
          const text = await resViews.text();
          console.log("Response Text:", text);

          // Check if the response is valid and parseable
          if (!text) {
            console.log(`No views data for documentId ${data[i].id}`);
            data[i].clickRate = 0; // Default to 0 if no views data
          } else {
            try {
              const viewsData = JSON.parse(text); // Attempt to parse the response

              // Ensure clickRate is set to 0 if no views are found
              if (viewsData && Array.isArray(viewsData)) {
                data[i].clickRate = viewsData.length; // Set clickRate based on the number of views
              } else {
                data[i].clickRate = 0; // Default to 0 if viewsData is not a valid array
              }
            } catch (error) {
              console.error(
                `Failed to parse views data for documentId ${data[i].id}:`,
                error
              );
              data[i].clickRate = 0; // Default to 0 if JSON parsing fails
            }
          }
        }

        // Sort by upload date
        data = data.sort(
          (a, b) =>
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );

        setKnowledgeItems(data);
      } catch (err) {
        console.error("Failed to fetch knowledge items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledge();
  }, []);

  const sortData = (column: SortColumn) => {
    let direction: SortDirection = "asc";

    if (sortColumn === column) {
      direction = sortDirection === "asc" ? "desc" : "asc";
    }

    setSortColumn(column);
    setSortDirection(direction);

    const sorted = [...knowledgeItems].sort((a, b) => {
      if (column === "name") {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return direction === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }

      if (column === "clickRate") {
        // Use actual clickRate values from knowledgeItems
        const rateA = a.clickRate ?? 0; // Default to 0 if clickRate is undefined
        const rateB = b.clickRate ?? 0; // Default to 0 if clickRate is undefined
        return direction === "asc" ? rateA - rateB : rateB - rateA;
      }

      return 0;
    });

    setKnowledgeItems(sorted);
  };

  const handleDelete = async (
    id: number,
    path: string,
    type: "pdf" | "mp3"
  ) => {
    if (!itemToDelete) return;

    try {
      const res = await fetch("/api/knowledge", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, path, type }),
      });

      if (res.ok) {
        setKnowledgeItems((prev) => prev.filter((item) => item.id !== id));
        setDeleteModalOpen(false); // Close the modal after deletion
        setItemToDelete(null); // Reset item to delete
      } else {
        const err = await res.json();
        alert(`Failed to delete: ${err.error}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Unexpected error occurred.");
    }
  };

  const filteredItems = knowledgeItems.filter((item) => {
    const matchesSearch = [item.name, item.tags, item.field]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesField =
      selectedFields === "Fields" || item.field === selectedFields;

    const matchesType =
      selectedType === "Type" ||
      item.type.toLowerCase() === selectedType.toLowerCase();

    return matchesSearch && matchesField && matchesType;
  });

  if (loading) {
    return <p className="text-gray-500 text-sm px-4 py-2">Loading...</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg">
      <table className="min-w-full table-fixed text-[16px] text-gray-600">
        <thead className="bg-white text-[#222] font-semibold">
          <tr>
            <th
              className="px-4 py-3 font-semibold text-left cursor-pointer"
              onClick={() => sortData("name")}
            >
              Document Name{" "}
              {sortColumn === "name" &&
                (sortDirection === "asc" ? (
                  <FaSortUp className="inline-block ml-1 text-m" />
                ) : (
                  <FaSortDown className="inline-block ml-1 text-m" />
                ))}
            </th>
            <th className="px-4 py-3 font-semibold text-center">
              Document Type
            </th>
            <th className="px-4 py-3 font-semibold text-center">Categories</th>
            <th className="px-4 py-3 font-semibold text-center">Fields</th>
            <th
              className="px-4 py-3 font-semibold text-center cursor-pointer"
              onClick={() => sortData("clickRate")}
            >
              Click Rate{" "}
              {sortColumn === "clickRate" &&
                (sortDirection === "asc" ? (
                  <FaSortUp className="inline-block ml-1 text-m" />
                ) : (
                  <FaSortDown className="inline-block ml-1 text-m" />
                ))}
            </th>
            <th className="px-4 py-3 font-semibold text-center">
              Document Date
            </th>
            <th className="px-4 py-3 font-semibold text-center">Operation</th>
          </tr>
        </thead>

        <tbody>
          {filteredItems.map((doc, index) => (
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
              <td className="text-center px-4 py-3 text-[#85878B]">
                {doc.clickRate ?? 0}{" "}
                {/* Render the clickRate or 0 if it's not available */}
              </td>
              <td className="px-4 py-3 text-[#85878B]">
                {new Date(doc.uploadedAt).toLocaleString("id-ID", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td className="px-4 py-3 flex gap-2 justify-center">
                <button
                  onClick={() => {
                    setEditData(doc);
                    setEditModalOpen(true);
                  }}
                  className="w-[32px] h-[24px] border border-[#EAECEB] rounded-[4px] flex items-center justify-center"
                >
                  <Image
                    src="/edit_icon.png"
                    alt="Edit"
                    className="h-[15px] w-[15px]"
                    width={15}
                    height={15}
                  />
                </button>
                <button
                  onClick={() => {
                    setItemToDelete(doc);
                    setDeleteModalOpen(true);
                  }}
                  className="w-[32px] h-[24px] border border-[#EAECEB] rounded-[4px] flex items-center justify-center"
                >
                  <Image
                    src="/delete_icon.png"
                    alt="Delete"
                    className="h-[15px] w-[13px]"
                    width={13}
                    height={15}
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

      {/* Add the custom delete confirmation modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        closeModal={() => setDeleteModalOpen(false)}
        onDelete={() => {
          if (itemToDelete) {
            handleDelete(itemToDelete.id, itemToDelete.path, itemToDelete.type);
          }
        }}
        itemName={itemToDelete?.name || ""}
      />
    </div>
  );
}

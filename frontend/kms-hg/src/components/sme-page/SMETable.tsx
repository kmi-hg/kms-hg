import { useState, useMemo } from "react";
import { ExpertItem } from "@/types/expertItem";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import DeleteConfirmationModal from "./DeleteConfirmationModal"; // Import the modal
import Image from "next/image"; // Importing Next.js Image component

type SMETableProps = {
  data: ExpertItem[];
  selectedAreaOfExpertise: string;
  selectedCoreCompetency: string;
  searchQuery: string;
  onEdit: (sme: ExpertItem) => void;
  onDelete: (id: number) => void;
};

export default function SMETable({
  data,
  selectedAreaOfExpertise,
  selectedCoreCompetency,
  searchQuery,
  onEdit,
  onDelete,
}: SMETableProps) {
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<"name" | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSMEToDelete, setSelectedSMEToDelete] =
    useState<ExpertItem | null>(null);

  const handleSortName = () => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newDirection);
    setSortColumn("name");
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesExpertise =
        selectedAreaOfExpertise === "Area of Expertise" ||
        item.expertise === selectedAreaOfExpertise;

      const matchesSBU =
        selectedCoreCompetency === "Core Competency" ||
        item.core_competency?.includes(selectedCoreCompetency); // ✅ Tambahkan filter Core Competency

      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.expertise.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesExpertise && matchesSBU && matchesSearch;
    });
  }, [data, selectedAreaOfExpertise, selectedCoreCompetency, searchQuery]);

  const sortedData = useMemo(() => {
    if (sortColumn === "name") {
      return [...filteredData].sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return sortDirection === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });
    }
    return filteredData;
  }, [filteredData, sortColumn, sortDirection]);

  const handleDeleteConfirmation = (sme: ExpertItem) => {
    setSelectedSMEToDelete(sme);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedSMEToDelete) {
      await onDelete(selectedSMEToDelete.id); 
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg">
      <table className="min-w-full table-fixed text-[16px] text-gray-600">
        <thead className="bg-white text-[#222] font-semibold">
          <tr>
            <th
              className="px-4 py-3 text-left cursor-pointer"
              onClick={handleSortName}
            >
              Expert Name{" "}
              {sortColumn === "name" &&
                (sortDirection === "asc" ? (
                  <FaSortUp className="inline-block ml-1 text-m" />
                ) : (
                  <FaSortDown className="inline-block ml-1 text-m" />
                ))}
            </th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Department</th>
            <th className="px-4 py-3 text-left">Position</th>
            <th className="px-4 py-3 text-left">Entitas</th>
            <th className="px-4 py-3 text-center">Area of Expertise</th>
            <th className="px-4 py-3 text-center">Core Competency</th>
            <th className="px-4 py-3 text-center">Upload Date</th>
            <th className="px-4 py-3 text-center">Operation</th>
          </tr>
        </thead>

        <tbody>
          {sortedData.length === 0 ? (
            <tr className="flex items-center justify-center">
              <td colSpan={6} className="text-center py-3 text-gray-500">
                No expert added
              </td>
            </tr>
          ) : (
            sortedData.map((sme, index) => (
              <tr
                key={sme.id}
                className={index % 2 === 0 ? "bg-[#FCFBFC]" : "bg-white"}
              >
                <td className="px-4 py-3 text-left text-[#85878B]">
                  {sme.name}
                </td>
                <td className="px-4 py-3 text-left text-[#85878B]">
                  {sme.email}
                </td>
                <td className="px-4 py-3 text-left text-[#85878B]">
                  {sme.department}
                </td>
                <td className="px-4 py-3 text-left text-[#85878B]">
                  {sme.position}
                </td>
                <td className="px-4 py-3 text-left text-[#85878B]">
                  {sme.entitas}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="bg-gray-100 text-[#85878B] px-2 py-1 rounded text-[14px]">
                    {sme.expertise}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {sme.core_competency?.map((item, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-[#85878B] px-2 py-1 rounded text-[12px]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-[#85878B]">
                  {new Date(sme.id).toLocaleDateString("id-ID")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 items-center justify-center w-full">
                    <button
                      onClick={() => onEdit(sme)}
                      className="border border-[#EAECEB] p-1 rounded-[4px] hover:bg-gray-50"
                    >
                      <Image
                        src="/edit_icon.png"
                        alt="Edit"
                        width={12}
                        height={12}
                        className="h-[12px] w-[12px]"
                      />
                    </button>
                    <button
                      onClick={() => handleDeleteConfirmation(sme)}
                      className="border border-[#EAECEB] p-1 rounded-[4px] hover:bg-gray-50"
                    >
                      <Image
                        src="/delete_icon.png"
                        alt="Delete"
                        width={11}
                        height={12}
                        className="h-[12px] w-[11px]"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        closeModal={() => setIsDeleteModalOpen(false)}
        onDelete={handleDelete}
        itemName={selectedSMEToDelete ? selectedSMEToDelete.name : ""}
      />
    </div>
  );
}

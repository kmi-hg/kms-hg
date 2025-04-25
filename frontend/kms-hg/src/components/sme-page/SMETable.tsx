import { useState, useMemo } from "react";
import { SMEItem } from "@/types";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import DeleteConfirmationModal from "./DeleteConfirmationModal"; // Import the modal

type SMETableProps = {
  data: SMEItem[];
  selectedAreaOfExpertise: string;
  selectedSBU: string;
  searchQuery: string;
  onEdit: (sme: SMEItem) => void;
  onDelete: (id: number) => void;
};

export default function SMETable({
  data,
  selectedAreaOfExpertise,
  selectedSBU,
  searchQuery,
  onEdit,
  onDelete,
}: SMETableProps) {
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<"name" | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSMEToDelete, setSelectedSMEToDelete] =
    useState<SMEItem | null>(null);

  const handleSortName = () => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newDirection);
    setSortColumn("name");
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesExpertise =
        selectedAreaOfExpertise === "Area of Expertise" ||
        item.area_of_expertise === selectedAreaOfExpertise;

      const matchesSBU = selectedSBU === "SBU" || item.sbu === selectedSBU;

      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.area_of_expertise
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.sbu.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesExpertise && matchesSBU && matchesSearch;
    });
  }, [data, selectedAreaOfExpertise, selectedSBU, searchQuery]);

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

  // Handle delete confirmation modal
  const handleDeleteConfirmation = (sme: SMEItem) => {
    setSelectedSMEToDelete(sme);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedSMEToDelete) {
      await onDelete(selectedSMEToDelete.id); // Pass delete function
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
            <th className="px-4 py-3 text-center">Area of Expertise</th>
            <th className="px-4 py-3 text-center">SBU</th>
            <th className="px-4 py-3 text-center">Upload Date</th>
            <th className="px-4 py-3 text-center">Operation</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((sme, index) => (
            <tr
              key={sme.id}
              className={index % 2 === 0 ? "bg-[#FCFBFC]" : "bg-white"}
            >
              <td className="relative px-4 py-3 truncate max-w-[250px] text-[#85878B] group cursor-pointer">
                {sme.name}
                <div className="absolute z-50 hidden group-hover:block bg-white text-[#222] text-sm px-3 py-2 rounded-md shadow-lg border border-gray-200 w-max max-w-[300px] left-1/2 -translate-x-1/2 top-full mt-1">
                  {sme.name}
                </div>
              </td>
              <td className="px-4 py-3 text-left text-[#85878B]">
                {sme.email}
              </td>
              <td className="px-4 py-3 text-center">
                <span className="bg-gray-100 text-[#85878B] px-2 py-1 rounded text-[14px]">
                  {sme.area_of_expertise}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="bg-gray-100 text-[#85878B] px-2 py-1 rounded text-[14px]">
                  {sme.sbu}
                </span>
              </td>
              <td className="px-4 py-3 text-center text-[#85878B]">
                {new Date(sme.id).toLocaleDateString("id-ID")}
              </td>
              <td className="px-4 py-3 flex gap-2 justify-center">
                <button
                  onClick={() => onEdit(sme)}
                  className="border border-[#EAECEB] p-1 rounded-[4px] hover:bg-gray-50 w-full flex justify-center"
                >
                  <img
                    src="/edit_icon.png"
                    alt="Edit"
                    className="h-[12px] w-[12px]"
                  />
                </button>
                <button
                  onClick={() => handleDeleteConfirmation(sme)} // Open modal
                  className="border border-[#EAECEB] p-1 rounded-[4px] hover:bg-gray-50 w-full flex justify-center"
                >
                  <img
                    src="/delete_icon.png"
                    alt="Delete"
                    className="h-[12px] w-[11px]"
                  />
                </button>
              </td>
            </tr>
          ))}
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

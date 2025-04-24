"use client";

import { useState } from "react";
import { SMEItem } from "@/types";
import { FaSortUp, FaSortDown } from "react-icons/fa";

type SMETableProps = {
  data: SMEItem[];
  onEdit: (sme: SMEItem) => void;
  onDelete: (id: number) => void;
};

export default function SMETable({ data, onEdit, onDelete }: SMETableProps) {
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortedData, setSortedData] = useState<SMEItem[]>(data);

  const handleSortName = () => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newDirection);

    const sorted = [...data].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return newDirection === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    setSortedData(sorted);
  };

  const tableData = sortedData.length ? sortedData : data;

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
              {sortDirection === "asc" ? (
                <FaSortUp className="inline-block ml-1 text-m" />
              ) : (
                <FaSortDown className="inline-block ml-1 text-m" />
              )}
            </th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-center">Area of Expertise</th>
            <th className="px-4 py-3 text-center">SBU</th>
            <th className="px-4 py-3 text-center">Upload Date</th>
            <th className="px-4 py-3 text-center">Operation Selected</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((sme, index) => (
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
                {new Date(sme.id).toLocaleString("id-ID", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
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
                  onClick={() => onDelete(sme.id)}
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
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import SMECard from "../../../components/sme-page/SMECard";
import SMEDetailModal from "../../../components/sme-page/SMEDetailModal";

interface SME {
  id: number;
  name: string;
  email: string;
  profile_url: string;
  area_of_expertise: string;
  sbu: string;
  bio: string;
}

export default function SMEClient() {
  const [smeList, setSmeList] = useState<SME[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSME, setSelectedSME] = useState<SME | null>(null);

  useEffect(() => {
    const fetchSMEs = async () => {
      try {
        const res = await fetch("/api/expert");
        const data = await res.json();
        console.log("Fetched SME data:", data);
        setSmeList(data);
      } catch (error) {
        console.error("Failed to fetch SME data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSMEs();
  }, []);

  if (loading) return <p>Loading SME data...</p>;
  if (!smeList.length) return <p>No SME data found.</p>;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[17px]">
        {smeList.map((sme) => (
          <div
            key={sme.id}
            onClick={() => setSelectedSME(sme)}
            className="cursor-pointer"
          >
            <SMECard
              name={sme.name}
              email={sme.email}
              profile_url={sme.profile_url}
              area_of_expertise={sme.area_of_expertise}
            />
          </div>
        ))}
      </div>

      <SMEDetailModal
        isOpen={!!selectedSME}
        sme={selectedSME}
        onClose={() => setSelectedSME(null)}
      />
    </>
  );
}

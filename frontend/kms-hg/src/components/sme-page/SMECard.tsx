import Image from "next/image"; // Importing the Next.js Image component

interface SMECardProps {
  name: string;
  email: string;
  profile_url: string;
  expertise: string;
  core_competency: string[]; // ← Tambahkan ini
}

export default function SMECard({
  name,
  email,
  profile_url,
  expertise,
  core_competency,
}: SMECardProps) {
  return (
    <div className="max-w-[325px] flex flex-col justify-between h-auto rounded-[10px] border border-[#d9d9d9] p-[20px]">
      <div className="flex justify-between items-start">
        <div className="h-[80px] w-[80px] rounded-full overflow-hidden bg-gray-200">
          <Image
            src={profile_url || "/default-profile-picture.png"}
            alt={`${name}'s profile`}
            className="h-full w-full object-cover"
            width={80}
            height={80}
          />
        </div>
        <div className="h-[18px] w-auto px-2 rounded-[10px] border border-[#3A40D4] text-[#3A40D4] text-[10px] flex justify-center items-center">
          {expertise}
        </div>
      </div>
      <div className="mt-3">
        <h1 className="text-black font-semibold text-[20px]">{name}</h1>
        <h2 className="text-gray-400 font-semibold text-[16px]">{email}</h2>
        <div className="mt-2 flex flex-wrap gap-1">
          {core_competency.map((item, idx) => (
            <span
              key={idx}
              className="text-[10px] bg-[#F0F0F0] text-[#333] px-2 py-1 rounded-full"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

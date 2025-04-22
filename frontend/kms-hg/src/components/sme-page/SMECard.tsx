interface SMECardProps {
  name: string;
  email: string;
  profile_url: string;
  area_of_expertise: string;
}

export default function SMECard({
  name,
  email,
  profile_url,
  area_of_expertise,
}: SMECardProps) {
  return (
    <div className="max-w-[325px] flex flex-col justify-between h-[190px] rounded-[10px] border border-[#d9d9d9] p-[20px]">
      <div className="flex justify-between items-start">
        <div className="h-[80px] w-[80px] rounded-full overflow-hidden bg-gray-200">
          <img
            src={profile_url}
            alt={`${name}'s profile`}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="h-[18px] w-auto px-2 rounded-[10px] border border-[#3A40D4] text-[#3A40D4] text-[10px] flex justify-center items-center">
          {area_of_expertise}
        </div>
      </div>
      <div>
        <h1 className="text-black font-semibold text-[20px]">{name}</h1>
        <h2 className="text-gray-400 font-semibold text-[16px]">{email}</h2>
      </div>
    </div>
  );
}

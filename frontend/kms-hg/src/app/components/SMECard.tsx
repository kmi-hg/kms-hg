export default function SMECard() {
  return (
    <div className="max-w-[325px] flex flex-col justify-between h-[190px] rounded-[10px] border border-[#d9d9d9] p-[20px]">
      <div className="flex justify-between align-start">
        <div className="h-[80px] w-[80px] bg-gray-300 rounded-[50px]"></div>
        <div className="h-[18px] w-[72px] rounded-[10px] border border-[#3A40D4] text-[#3A40D4] text-[10px] flex justify-center">
          Knowledge
        </div>
      </div>
      <div>
        <h1 className="text-black font-bold text-[20px]">Teuku Fajar Akbar</h1>
        <h2 className="text-gray-400 font-medium text-[16px]">
          teuku.fajar@hasnurgroup.com
        </h2>
      </div>
    </div>
  );
}

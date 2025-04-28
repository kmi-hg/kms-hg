import Image from "next/image";
import { signOut } from "next-auth/react";

export default function Header() {
  return (
    <div className="xl:w-full xl:h-[82px] bg-white rounded-[20px] border border-[#e0e0e0] px-[22px] py-[19px] flex items-center justify-between">
      {/* Logo Hasnur */}
      <div className="w-[45px] h-[45px] relative">
        <Image
          src="/logo-hasnur-group.png"
          alt="Hasnur Group Logo"
          fill
          className="object-contain"
          sizes="45px"
        />
      </div>

      {/* Menu */}
      <div className="flex items-center gap-[54px]">
        <div className="flex items-center gap-[40px]">
          {[
            "Idea Basket",
            "Knowledge Management System",
            "Innovation Management System",
            "Learning Management System",
          ].map((item) => (
            <a
              key={item}
              href="#"
              className="text-black text-[14px] font-medium font-figtree"
            >
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-[6px]">
          <div className="h-[30px] w-[30px] relative">
            <Image
              src="/profile.png"
              alt="User Profile"
              fill
              className="object-cover rounded-full"
              sizes="30px"
            />
          </div>
          <div className="h-[16px] w-[16px] relative">
            <Image
              src="/dropdown.png"
              alt="Dropdown Icon"
              fill
              className="object-contain"
              sizes="16px"
            />
          </div>
          {/* temporary sign ou button */}
          <button className="text-black" onClick={() => signOut()}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

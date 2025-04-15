import Image from 'next/image'

export default function Header() {
    return (
      <div className="xl:w-full xl:h-[82px] bg-[#ffffff] rounded-[20px] border border-[#e0e0e0] px-[22px] py-[19px] flex items-center justify-between">
        {/* Logo Hasnur */}
        <div className="w-[45px] h-[45px]">
          <Image src="logo-hasnur-group.png" alt="Hasnur Group" />
        </div>
  
        {/* Menu */}
        <div className="flex items-center gap-[54px]">
          <div className="flex items-center gap-[40px]">
            <a
              href="#"
              className="text-[#000000] text-[14px] font-medium font-figtree"
            >
              Idea Basket
            </a>
            <a href="#" className="text-[#000000] text-[14px] font-medium font-figtree">
              Knowledge Management System
            </a>
            <a href="#" className="text-[#000000] text-[14px] font-medium font-figtree">
              Innovation Management System
            </a>
            <a href="#" className="text-[#000000] text-[14px] font-medium font-figtree">
              Learning Management System
            </a>
          </div>
          <div className="flex items-center gap-[6px]">
            <div className="h-[30px] w-[30px]">
              <Image src="profile.png" alt="Hasnur Group" />
            </div>
            <div className="h-[16px] w-[16px]">
              <Image src="dropdown.png" alt="Hasnur Group" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
import Head from "next/head";
import Image from "next/image";
import RecentlyOpenedCard from "@/app/components/recently_opened_card";
import Header from "./components/header";

export default function Home() {
  return (
    <div>
      <Header/>

      {/* Recently Opened Files Section */}
      <section>
        <h2 className="text-lg font-semibold text-black mb-2 text-[24px] mt-[30px] mb-[30px] font-figtree">
          Recently Opened
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[17px]">
          {[...Array(4)].map((_, index) => (
            <RecentlyOpenedCard key={index} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-black mb-2 text-[24px] mt-[30px] mb-[30px] font-figtree">
          Features
        </h2>
        <div className="flex items-center gap-[30px]">

          {/* Subject Matter Expert */}
          <div
            className="flex items-center w-full lg:w-[325px] h-[77px] bg-white rounded-[12px] p-4 gap-4"
            style={{ boxShadow: "0px 0px 5.6px 0px rgba(0, 0, 0, 0.25)" }}
          >
            <div className="w-[48px] h-[48px] bg-[#3D5AFE] flex items-center justify-center rounded-full"></div>
            <div>
              <h3 className="text-black font-semibold text-[18px] font-figtree">
                Subject Matter Expert
              </h3>
              <p className="text-[#595959] font-semibold text-[14px] font-figtree">
                Ask the Expert
              </p>
            </div>
          </div>

          {/* Hasnur Chat */}
          <div
            className="flex items-center w-full lg:w-[325px] h-[77px] bg-white rounded-[12px] p-4 gap-4"
            style={{ boxShadow: "0px 0px 5.6px 0px rgba(0, 0, 0, 0.25)" }}
          >
            <div className="w-[48px] h-[48px] bg-[#3D5AFE] flex items-center justify-center rounded-full"></div>
            <div>
              <h3 className="text-black font-semibold text-[18px] font-figtree">
                Hasnur Chat
              </h3>
              <p className="text-[#595959] font-semibold text-[14px] font-figtree">
                Ask the AI
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* All Files Section */}
      <section>
        <h2 className="text-lg font-semibold text-black mb-2 text-[24px] mt-[30px] mb-[30px] font-figtree">
          All Files
        </h2>
      </section>
    </div>
  );
}

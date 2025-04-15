// /components/FeatureCard.tsx
import Link from "next/link";
import Image from 'next/image'

export default function FeatureCard({
  href,
  iconSrc,
  title,
  description,
}: {
  href: string;
  iconSrc: string;
  title: string;
  description: string;
}) {
  return (
    <Link href={href} passHref>
      <div
        className="flex items-center w-full lg:w-[325px] h-[77px] bg-white rounded-[12px] p-4 gap-4"
        style={{ boxShadow: "0px 0px 5.6px 0px rgba(0, 0, 0, 0.25)" }}
      >
        <div className="w-[48px] h-[48px] bg-[#3D5AFE] flex items-center justify-center rounded-full">
          <div className="h-[30px] w-[30px]">
            <Image src={iconSrc} alt={title} />
          </div>
        </div>
        <div>
          <h3 className="text-black font-semibold text-[18px] font-figtree">{title}</h3>
          <p className="text-[#595959] font-semibold text-[14px] font-figtree">{description}</p>
        </div>
      </div>
    </Link>
  );
}

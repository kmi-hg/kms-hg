import Image from "next/image";
import { useRouter } from "next/navigation";

const formatFileSize = (size: number) => {
  if (size === null || size === undefined || isNaN(size)) {
    return "Unknown Size";
  }
  return `${size.toFixed(2)} MB`;
};

type File = {
  fileId: string;
  fileName: string;
  fileUrl: string;
  size: number;
  openedAt: string;
  thumbnailPath?: string;
};

export default function RecentlyOpenedCard({ file }: { file: File }) {
  const router = useRouter();

  const handleDoubleClick = () => {
    if (file.fileUrl && file.fileUrl.toLowerCase().trim().endsWith(".mp3")) {
      const track = {
        title: file.fileName,
        artist: "Unknown Artist",
        src: file.fileUrl,
        thumbnail: file.thumbnailPath || "cth-knowledge.png",
      };
      localStorage.setItem("selectedTrack", JSON.stringify(track));

      const slug = file.fileName
        .toLowerCase()
        .replace(/\.[^/.]+$/, "")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "");

      router.push(`/knowledge/${slug}`);
    } else if (file.fileUrl) {
      window.open(file.fileUrl, "_blank");
    }

    fetch("/api/recently-opened-files", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileId: file.fileId,
        fileName: file.fileName,
        fileUrl: file.fileUrl,
        fileSize: file.size,
      }),
    }).catch((error) => {
      console.error("Error adding to recently opened:", error);
    });
  };

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "numeric",
    };
    return new Date(date).toLocaleDateString("id-ID", options);
  };

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className="w-full bg-white rounded-lg border border-gray-300 flex items-center gap-4 p-4 shadow-sm cursor-pointer"
    >
      <div className="min-w-[80px] h-[80px] sm:h-[95px] sm:w-[95px] rounded-md overflow-hidden bg-gray-200 flex items-center justify-center relative">
        <Image
          src={file.thumbnailPath || "/cth-knowledge.png"}
          alt={file.fileName}
          fill
          className="object-cover"
          sizes="95px"
        />
      </div>
      <div className="flex flex-col justify-between">
        <h3 className="text-[16px] font-figtree font-semibold text-gray-900 leading-tight line-clamp-2">
          {file.fileName}
        </h3>
        <p className="text-[14px] text-[#ADADAD] font-figtree text-gray-500 mt-1">
          {formatDate(file.openedAt)}
        </p>
        <p className="text-[14px] text-[#ADADAD] font-figtree text-gray-500 mt-1">
          {formatFileSize(file.size)}
        </p>
      </div>
    </div>
  );
}

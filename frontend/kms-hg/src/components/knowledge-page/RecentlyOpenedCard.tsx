import Image from "next/image";
import { useRouter } from "next/navigation";

// Function to convert bytes to human-readable format (KB, MB, etc.)
const formatFileSize = (size: number) => {
  if (size === null || size === undefined || isNaN(size)) {
    return "Unknown Size"; // Fallback if the size is invalid
  }
  return `${size.toFixed(2)} MB`; // Display size in MB, assuming it's already in MB
};

export default function RecentlyOpenedCard({ file }: { file: any }) {
  const router = useRouter();

  // This function handles the double-click event
  const handleDoubleClick = () => {
    // If the file is of type MP3
    if (file.fileUrl && file.fileUrl.toLowerCase().trim().endsWith(".mp3")) {
      const track = {
        title: file.fileName,
        artist: "Unknown Artist", // Can be updated later if the artist info is available
        src: file.fileUrl,
        thumbnail: file.thumbnailPath || "cth-knowledge.png", // Fallback thumbnail
      };
      localStorage.setItem("selectedTrack", JSON.stringify(track));

      // Generate a slug from the file name
      const slug = file.fileName
        .toLowerCase()
        .replace(/\.[^/.]+$/, "")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "");

      router.push(`/knowledge/${slug}`); // Navigate to the MP3 player page
    } else if (file.fileUrl) {
      // For non-MP3 files, open the file URL in a new tab
      window.open(file.fileUrl, "_blank");
    }

    // Log the file in the recently opened files
    fetch("/api/recently-opened-files", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileId: file.fileId, // fileId from the recently opened file data
        fileName: file.fileName, // fileName from the recently opened file data
        fileUrl: file.fileUrl,
        fileSize: file.size, // Ensure we're passing the size
      }),
    }).catch((error) => {
      console.error("Error adding to recently opened:", error);
    });
  };

  // Function to format the date in "Mei 31, 2022" format
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
      onDoubleClick={handleDoubleClick} // Attach the double-click handler here
      className="w-full bg-white rounded-lg border border-gray-300 flex items-center gap-4 p-4 shadow-sm cursor-pointer"
    >
      {/* Thumbnail Image */}
      <div className="min-w-[80px] h-[80px] sm:h-[95px] sm:w-[95px] rounded-md overflow-hidden bg-gray-200 flex items-center justify-center relative">
        <Image
          src={file.thumbnailPath || "/cth-knowledge.png"}
          alt={file.fileName} // fileName as alt text
          fill
          className="object-cover"
          sizes="95px"
        />
      </div>

      {/* Text Content */}
      <div className="flex flex-col justify-between">
        <h3 className="text-[16px] font-figtree font-semibold text-gray-900 leading-tight line-clamp-2">
          {file.fileName} {/* Display the file name */}
        </h3>
        <p className="text-[14px] text-[#ADADAD] font-figtree text-gray-500 mt-1">
          {formatDate(file.openedAt)} {/* Format the date as "Mei 31, 2022" */}
        </p>
        <p className="text-[14px] text-[#ADADAD] font-figtree text-gray-500 mt-1">
          {formatFileSize(file.size)} {/* Display the file size */}
        </p>
      </div>
    </div>
  );
}

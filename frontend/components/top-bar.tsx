import React from "react";
import { DownloadIcon } from "lucide-react";

type Props = {
  className?: string;
};

function Logo({ className }: Props) {
  return (
    <div
      className={`text-2xl flex flex-row lg:text-3xl text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-50 uppercase
            ${className} gap-5
        `}
      style={{
        fontFamily: "var(--poppins-semi-bold)",
      }}
    >
      <p>YOUTUBE DOWNLOADER</p>
      <DownloadIcon
        className="text-3xl lg:text-4xl h-8 w-8"
        strokeWidth={1}
        height={30}
        width={30}
        color="white"
      />
    </div>
  );
}

export default function TopBar() {
  return (
    <div className="flex justify-between items-center p-4 absolute w-full top-0 left-0 backdrop-blur-lg">
      <Logo className="text-2xl lg:text-3xl" />
    </div>
  );
}

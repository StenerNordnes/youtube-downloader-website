/* eslint-disable @next/next/no-img-element */
"use client";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";

const BackendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Home() {
  const [link, setLink] = useState("");

  const fetchVideoMetadata = async (url: string) => {
    const response = await fetch(`${BackendURL}/api/download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error("Could not find youtube video");
    }

    const data = await response.json();

    const videoLength = Number(data.duration);
    const hours = Math.floor(videoLength / 3600);
    const minutes = Math.floor((videoLength % 3600) / 60);
    const seconds = Math.floor(videoLength % 60);

    return {
      title: data.title,
      thumbnail: data.thumbnail,
      duration: `${hours ? hours + "h " : ""}${
        minutes ? minutes + "m " : ""
      }${seconds}s`,
      downloadLink: BackendURL + data.download_link,
    };
  };

  const {
    data: videoMetadata,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["videoMetadata", link],
    queryFn: () => fetchVideoMetadata(link),
    enabled: false,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    refetch();
  };

  const handleDownload = async () => {
    if (!videoMetadata?.downloadLink) {
      return;
    }

    try {
      const response = await fetch(videoMetadata.downloadLink);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const element = document.createElement("a");
      element.href = url;
      element.download = videoMetadata.title + ".mp4";
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
      document.body.removeChild(element); // Clean up
      window.URL.revokeObjectURL(url); // Free up memory
    } catch (error) {
      console.error("Error downloading the video:", error);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gradient-to-bl from-black to-gray-900">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 items-center sm:items-start rounded-md w-full"
        >
          <Input
            placeholder="Input a youtube link"
            className="w-full rounded-xl border-blue-500/20 focus:border-gray-900 max-w-lg self-center focus-visible:ring-2 focus-visible:ring-blue-800/50"
            value={link}
            onChange={(e) => {
              const text = e.target.value;
              setLink(text);
            }}
          />
        </form>
        <motion.div
          className={`flex flex-col gap-4 items-center self-center sm:items-start w-full max-w-lg p-4
             rounded-xl border-2 border-gray-900
            `}
          layout={"size"}
        >
          <motion.p
            className="text-gray-600 self-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            layout={"size"}
          >
            {error && "Could not find youtube video"}
            {isLoading && "Loading..."}
          </motion.p>

          {videoMetadata && (
            <div className="flex flex-col gap-4 items-center sm:items-start">
              <h2 className="text-xl font-bold">{videoMetadata.title}</h2>
              <img
                src={videoMetadata.thumbnail}
                alt="Video thumbnail"
                className="object-cover rounded-xl"
                width={320}
                height={180}
              />
              <p className="text-gray-600">{videoMetadata.duration}</p>
            </div>
          )}
          {videoMetadata?.downloadLink && (
            <a>
              <button
                onClick={handleDownload}
                className="px-4 py-2 text-white rounded-2xl bg-gradient-to-tr from-blue-300 to-blue-950"
              >
                Download Video
              </button>
            </a>
          )}
        </motion.div>
      </main>
    </div>
  );
}

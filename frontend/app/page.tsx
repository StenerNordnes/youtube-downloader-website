/* eslint-disable @next/next/no-img-element */
"use client";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const BackendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Home() {
  const [link, setLink] = useState("");
  const [videoMetadata, setVideoMetadata] = useState({
    title: "",
    thumbnail: "",
    duration: "",
    downloadLink: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted link", link);

    try {
      const response = await fetch(`${BackendURL}/api/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: link }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      const videoLength = Number(data.duration);
      const hours = Math.floor(videoLength / 3600);
      const minutes = Math.floor((videoLength % 3600) / 60);
      const seconds = Math.floor(videoLength % 60);

      setVideoMetadata({
        title: data.title,
        thumbnail: data.thumbnail,
        duration: `${hours ? hours + "h " : ""}${
          minutes ? minutes + "m " : ""
        }${seconds}s`,
        downloadLink: BackendURL + data.downloadLink,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDownload = async () => {
    if (!videoMetadata.downloadLink) {
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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 items-center sm:items-start"
        >
          <Input
            placeholder="Input a youtube link"
            value={link}
            onChange={(e) => {
              const text = e.target.value;
              setLink(text);
              if (text.trim() === "" || videoMetadata.downloadLink) {
                setVideoMetadata({
                  title: "",
                  thumbnail: "",
                  duration: "",
                  downloadLink: "",
                });
              }
            }}
          />
        </form>
        {videoMetadata.title && (
          <div className="flex flex-col gap-4 items-center sm:items-start">
            <h2 className="text-xl font-bold">{videoMetadata.title}</h2>
            <img
              src={videoMetadata.thumbnail}
              alt="Video thumbnail"
              className="object-cover rounded-md"
              width={320}
              height={180}
            />
            <p>{videoMetadata.duration}</p>
          </div>
        )}

        {videoMetadata.downloadLink && (
          <a>
            <button
              onClick={handleDownload}
              className="px-4 py-2 text-white rounded-md bg-gradient-to-tr from-blue-300 to-blue-950"
            >
              Download Video
            </button>
          </a>
        )}
      </main>
    </div>
  );
}

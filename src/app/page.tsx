"use client";

import { useState } from "react";

export default function HomePage() {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const res = await fetch("/api/generateLink", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        expiresIn: "2h", // Change this to your desired duration (e.g. "1d", "6h")
      }),
    });

    const data = await res.json();
    if (data.link) {
      setLink(data.link);
    } else {
      alert("Failed to generate link");
    }
    setLoading(false);
  };

  return (
    <main className="p-10 text-white">
      <h1 className="text-2xl font-bold mb-4">Generate ADHD Mapping Link</h1>
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        {loading ? "Generating..." : "Generate Mapping"}
      </button>

      {link && (
        <div className="mt-6">
          <p className="text-green-400">Share this link:</p>
          <a href={link} target="_blank" className="underline text-blue-300">
            {link}
          </a>
        </div>
      )}
    </main>
  );
}

// <div className="flex flex-col items-center justify-center min-h-fit w-fit p-4   text-slate-100 m-auto rounded-lg">

// </div>

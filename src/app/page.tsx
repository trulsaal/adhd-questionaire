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
    <main className="w-fit  p-10">
      <h1 className="text-2xl font-bold mb-4 ">
        {!link
          ? "Screening for ADHD. Trykk på knappen under for å generere link til bruker"
          : "Send linken til kandidaten"}
      </h1>
      <button
        onClick={handleGenerate}
        disabled={loading}
        className={
          !link
            ? "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer transition-all duration-300 ease-in-out"
            : "bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed opacity-50"
        }
      >
        {loading ? "Genererer..." : "Generer link"}
      </button>

      {link && (
        <div className="mt-6">
          <a href={link} className="underline text-blue-500 text-lg">
            {link}
          </a>
        </div>
      )}
    </main>
  );
}

// <div className="flex flex-col items-center justify-center min-h-fit w-fit p-4   text-slate-100 m-auto rounded-lg">

// </div>

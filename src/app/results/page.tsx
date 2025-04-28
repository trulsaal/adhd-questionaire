"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { FaCircleArrowLeft } from "react-icons/fa6";

export default function ResultsPage() {
  const [results, setResults] = useState<
    { statement: string; score: number }[]
  >([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("surveyResults");
    if (stored) {
      setResults(JSON.parse(stored));
    }
  }, []);

  const handleSendAnswers = async () => {
    setSending(true);
    try {
      const filteredResults = results.filter((item) => item.score >= 3);

      const response = await fetch("/api/sendAnswers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          responses: filteredResults,
          submittedAt: new Date().toISOString(),
        }),
      });

      // Log raw response for debugging
      const responseText = await response.text();
      console.log("Raw response:", responseText);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }

      const responseData = JSON.parse(responseText);
      console.log("Submission success:", responseData);
      setSent(true);
    } catch (error) {
      console.error("Submission failed:", error);
      alert(
        error instanceof Error && error.message.includes("permission")
          ? "Server configuration error. Please contact support."
          : "Failed to submit. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="md:p-24 rounded-2xl bg-gray-800 gap-4 flex flex-col w-fit m-auto">
      <div className="p-4 md:p-0">
        <h1>
          Følgende faktorer kan ha betydning og bør vies oppmerksomhet når{" "}
          <strong>navn</strong> skal være i en arbeidssituasjon:
        </h1>
      </div>

      <div className="border-[1px] border-gray-700 rounded-lg p-4">
        <h2>Score 4:</h2>
        {results
          .filter((item) => item.score === 4)
          .map((item, index) => (
            <div
              key={index}
              className="mb-1 md:h-10 gap-2 flex items-center px-2 rounded"
            >
              <FaPlusCircle className="text-pink-400 size-3" />
              <p className="text-white text-[12px] md:text-sm">
                {item.statement}
              </p>
            </div>
          ))}
      </div>

      <div className="border-[1px] border-gray-700 rounded-lg p-4">
        <h2>Score 3:</h2>
        {results
          .filter((item) => item.score === 3)
          .map((item, index) => (
            <div
              key={index}
              className="mb-1 h-10 gap-2 flex items-center px-2 rounded"
            >
              <FaPlusCircle className="text-pink-300 size-3" />
              <p className="text-white text-sm">{item.statement}</p>
            </div>
          ))}
      </div>
      {sent && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg">
          Answers submitted successfully!
        </div>
      )}
      {/* === Submit Button === */}
      <button
        className="mt-6 px-10 py-3 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-600 transition-all duration-300 disabled:bg-gray-400"
        onClick={handleSendAnswers}
        disabled={sending || sent} // Disable if sending or already sent
      >
        {sent ? "Svar sendt!" : sending ? "Sender..." : "Send svar"}
      </button>

      {/* === Back Link === */}
      <Link
        className="items-center flex flex-row gap-2 bg-white text-lg font-bold w-fit px-10 py-2 rounded-full hover:bg-gray-300 transition-all duration-300 mt-6"
        href="/"
      >
        <FaCircleArrowLeft className="size-5" />
        Tilbake
      </Link>
    </div>
  );
}

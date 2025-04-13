"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { FaCircleArrowLeft } from "react-icons/fa6";

export default function ResultsPage() {
  const [results, setResults] = useState<
    { statement: string; score: number }[]
  >([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("surveyResults");
    if (stored) {
      setResults(JSON.parse(stored));
    }
  }, []);

  if (!results.length) {
    return <p>Loading results...</p>;
  }

  return (
    <div className="md:p-24 rounded-2xl bg-gray-800 gap-4 flex flex-col w-fit m-auto">
      <div className="p-4 md:p-0">
        <h1 className="">Områder kandidaten kan ha utfordringer med</h1>
        <h3>
          Følgende faktorer kan ha betydning og bør vies oppmerksomhet når{" "}
          <strong>navn</strong> skal være i en arbeidssituasjon:
        </h3>
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
              <p className="text-white text-[12px] md:text-normal">
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
              <p className="text-white text-normal">{item.statement}</p>
            </div>
          ))}
      </div>
      <Link
        className="items-center flex flex-row gap-4 bg-white text-lg font-bold w-fit px-10 py-4 rounded-full hover:bg-gray-300 transition-all duration-300 "
        href="/"
      >
        <FaCircleArrowLeft className="size-6" />
        Tilbake
      </Link>
    </div>
  );
}

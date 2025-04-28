"use client";

import { client } from "@/sanity/lib/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowCircleRight, FaFileAlt } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";

export default function Survey() {
  interface Survey {
    _id: string;
    title: string;
    statements: string[];
  }

  const [surveyData, setSurveyData] = useState<Survey | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const router = useRouter();

  useEffect(() => {
    client
      .fetch('*[_type == "survey"]{_id, title, statements}')
      .then((data) => {
        if (data.length > 0) {
          setSurveyData(data[0]);
        }
      });
  }, []);

  useEffect(() => {
    if (surveyData) {
      const storedAnswers = sessionStorage.getItem("surveyAnswers");
      if (storedAnswers) {
        setAnswers(JSON.parse(storedAnswers));
      }
    }
  }, [surveyData]);

  // Handle the radio button change
  const handleChange = (index: number, score: number) => {
    const updatedAnswers = {
      ...answers,
      [index]: score,
    };

    setAnswers(updatedAnswers);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("surveyAnswers", JSON.stringify(updatedAnswers));
    }
  };

  const handleReset = () => {
    setAnswers({});
    sessionStorage.removeItem("surveyAnswers");

    const body = document.body;

    // Remove the class if it already exists to retrigger the animation
    body.classList.remove("flash-bg");

    // Force reflow to allow re-adding the class
    void body.offsetWidth;

    // Add the class to trigger animation
    body.classList.add("flash-bg");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Construct the response
    if (!surveyData) {
      console.error("Survey data is not available.");
      return;
    }

    const response = {
      surveyId: surveyData._id,
      answers: Object.entries(answers).map(([index, score]) => ({
        statement: surveyData.statements[parseInt(index, 10)],
        score,
      })),
    };

    // 1. Log to console for debugging
    console.log("User answers:", response);

    // 2. Save to sessionStorage to pass to /results
    if (typeof window !== "undefined") {
      sessionStorage.setItem("surveyResults", JSON.stringify(response.answers));
    }

    // 3. Submit to your API
    try {
      const res = await fetch("/api/submitSurvey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(response),
      });

      if (!res.ok) {
        console.error("Failed to submit survey:", await res.text());
      } else {
        console.log("Survey submitted successfully!");
      }
    } catch (err) {
      console.error("Error submitting survey:", err);
    }

    // 4. Redirect to /results page
    router.push("/results");
  };

  if (!surveyData) {
    return <div className="text-white p-10">Laster kartlegging...</div>;
  }

  return (
    <form
      className="md:p-14 rounded-2xl bg-gray-800 gap-1 flex flex-col w-fit m-auto"
      onSubmit={handleSubmit}
    >
      <div className="mb-4 flex flex-row h-fit w-full justify-between items-center">
        <div className="flex flex-row gap-2 items-center h-10">
          <FaFileAlt className="size-10" />
          <h1 className="">{surveyData.title}</h1>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="cursor-pointer flex flex-row  gap-2  items-center bg-red-400 text-white py-2 px-6 font-bold text-lg rounded-full hover:transition-all duration-500  hover:bg-red-400"
        >
          Tilbakestill svar
          <FaCircleXmark className="size-5" />
        </button>
      </div>

      {surveyData.statements.map((statement, index) => (
        <div className="flex flex-col " key={index}>
          <div className="flex flex-row justify-between md:gap-24 border-[1px] border-gray-700 rounded-lg md:p-4 p-2 mb-4 items-center border-l-8">
            <p className="text-[12px] md:text-lg">{statement}</p>
            <div className=" mt-2 mb-8 flex flex-row items-center md:gap-4 md:my-auto">
              {[0, 1, 2, 3, 4].map((score) => (
                <label
                  className={`cursor-pointer active:translate-y-1.5 ease-out transition-transform duration-200 flex items-center justify-center w-7 h-7 md:w-8 md:h-8 md:rounded-full border-2 hover:bg-slate-700 hover:text-white border-gray-200 font-medium text-2xl
                    ${answers[index] === score ? "box-shadow text-white" : "bg-white text-black"}
                    transition-colors duration-150`}
                  key={score}
                >
                  <input
                    type="radio"
                    name={`statement-${index}`}
                    value={score}
                    onChange={() => handleChange(index, score)}
                    checked={answers[index] === score}
                    className="sr-only" // hides the actual radio button
                  />
                  {score}
                </label>
              ))}
            </div>
          </div>
        </div>
      ))}
      <div className="w-full flex  items-center mt-10 justify-end  ">
        <button
          className="cursor-pointer flex flex-row  gap-2  items-center bg-slate-100 py-2 px-6 text-gray-800 font-semibold text-lg rounded-full transition-all duration-300  hover:bg-white"
          type="submit"
        >
          Se resultat <FaArrowCircleRight className="size-6" />
        </button>
      </div>
    </form>
  );
}

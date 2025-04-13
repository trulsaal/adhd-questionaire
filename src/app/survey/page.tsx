"use client";

import { client } from "@/sanity/lib/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowCircleRight } from "react-icons/fa";

export default function Survey() {
  const [surveyData, setSurveyData] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    // Fetch survey data from Sanity
    client.fetch('*[_type == "survey"]{title, statements}').then((data) => {
      if (data.length > 0) {
        setSurveyData(data[0]); // Assuming there is only one survey document
      }
    });
  }, []);

  if (!surveyData) {
    return <div>Loading...</div>;
  }

  // Handle the radio button change
  const handleChange = (index, score) => {
    setAnswers({
      ...answers,
      [index]: score, // Store the score for the statement
    });
  };

  // Inside your component
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Construct the response
    const response = {
      surveyId: surveyData._id,
      answers: Object.keys(answers).map((index) => ({
        statement: surveyData.statements[Number(index)],
        score: answers[index],
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

  return (
    <form
      className="md:p-24 rounded-2xl bg-gray-800 gap-1 flex flex-col w-fit m-auto"
      onSubmit={handleSubmit}
    >
      <h1 className="mb-10">{surveyData.title}</h1>

      {surveyData.statements.map((statement, index) => (
        <div className="flex flex-col " key={index}>
          <div className="flex flex-row justify-between md:gap-24 border-[1px] border-gray-700 rounded-lg md:p-4 p-2 mb-4 items-center">
            <p className="text-[12px] md:text-lg">{statement}</p>
            <div className=" mt-2 mb-4 flex flex-row items-center md:gap-4 my-auto">
              {[0, 1, 2, 3, 4].map((score) => (
                <label
                  className={`cursor-pointer flex items-center justify-center w-7 h-7 md:w-10 md:h-10 md:rounded-full border hover:bg-pink-300  border-gray-600 font-bold
                    ${answers[index] === score ? "bg-pink-400 text-white" : "bg-white text-black"}
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
          className="cursor-pointer flex flex-row  gap-4  items-center bg-slate-100 py-4 px-6 text-gray-800 font-bold text-lg rounded-full hover:translate-x-1 transition-transform ease-in duration-300 hover:shadow-2xl shadow-black hover:bg-white"
          type="submit"
        >
          Se resultat <FaArrowCircleRight className="size-6" />
        </button>
      </div>
    </form>
  );
}

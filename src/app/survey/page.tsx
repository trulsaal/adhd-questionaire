"use client";

import { client } from "@/sanity/lib/client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FaFileAlt } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { Suspense } from "react";

export default function Survey() {
  interface Survey {
    _id: string;
    title: string;
    statements: string[];
  }

  const [surveyData, setSurveyData] = useState<Survey | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const searchParams = useSearchParams();

  // Step 1: Token validation
  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setError("Mangler tilgangstoken.");
      return;
    }

    const validateToken = async () => {
      try {
        const res = await fetch("/api/verifyToken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) {
          const data = await res.json();
          console.error("Token verification failed:", data.error);
          setError("Ugyldig eller utløpt lenke.");
          return;
        }

        const data = await res.json();
        console.log("✅ Token valid:", data.decoded);
      } catch (err) {
        console.error("Network or server error:", err);
        setError("Feil under validering av lenken.");
      }
    };

    validateToken();
  }, [searchParams]);

  // Step 2: Fetch survey if token is valid
  useEffect(() => {
    if (error) return;

    client
      .fetch('*[_type == "survey"]{_id, title, statements}')
      .then((data) => {
        if (data.length > 0) {
          setSurveyData(data[0]);
        }
      });
  }, [error]);

  useEffect(() => {
    if (surveyData) {
      const storedAnswers = sessionStorage.getItem("surveyAnswers");
      if (storedAnswers) {
        setAnswers(JSON.parse(storedAnswers));
      }
    }
  }, [surveyData]);

  const handleChange = (index: number, score: number) => {
    const updatedAnswers = { ...answers, [index]: score };
    setAnswers(updatedAnswers);
    sessionStorage.setItem("surveyAnswers", JSON.stringify(updatedAnswers));
  };

  const handleReset = () => {
    setAnswers({});
    sessionStorage.removeItem("surveyAnswers");
    document.body.classList.remove("flash-bg");
    void document.body.offsetWidth;
    document.body.classList.add("flash-bg");
  };

  const router = useRouter();

  const handleSendAnswers = async () => {
    if (!surveyData) return;

    const formattedResponses = Object.entries(answers).map(
      ([index, score]) => ({
        statement: surveyData.statements[parseInt(index, 10)],
        score,
      })
    );

    const filteredResponses = formattedResponses.filter((r) => r.score >= 3);

    sessionStorage.setItem("surveyResults", JSON.stringify(filteredResponses));
    setSending(true);

    try {
      const response = await fetch("/api/sendAnswers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responses: filteredResponses,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }

      setSent(true);
      sessionStorage.removeItem("surveyAnswers");
      sessionStorage.removeItem("surveyResults");

      // Redirect to thank-you page
      router.push("/thank-you");
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
    <Suspense fallback={<div>Loading...</div>}>
      <form
        className="md:p-14 rounded-2xl gap-1 p-4 flex flex-col w-fit"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="mb-4 flex flex-row h-fit w-full justify-between items-center">
          <div className="flex flex-row gap-2 items-center h-10">
            <FaFileAlt className="size-10" />
            <h1 className="">{surveyData?.title || "Loading..."}</h1>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="cursor-pointer flex flex-row gap-2 items-center bg-red-300 text-gray-800 md:py-2 py-2 px-2 md:px-6 font-bold text-sm md:text-lg rounded-lg hover:transition-all duration-500 hover:bg-red-400"
          >
            Tilbakestill svar
            <FaCircleXmark className="size-5" />
          </button>
        </div>

        {surveyData?.statements?.map((statement, index) => (
          <div className="flex flex-col" key={index}>
            <div className="flex flex-row justify-between md:gap-24 border-[1px] border-gray-700 rounded-lg md:p-4 p-2 mb-4 items-center border-l-8">
              <p className="text-[12px] md:text-lg">{statement}</p>
              <div className="md:mt-2 md:mb-8 flex flex-row items-center md:gap-4 md:my-auto">
                {[0, 1, 2, 3, 4].map((score) => (
                  <label
                    className={`cursor-pointer active:translate-y-1.5 ease-out transition-transform duration-200 flex items-center justify-center w-7 h-7 md:w-8 md:h-8 md:rounded-full border-2 hover:bg-slate-700 hover:text-white border-gray-200 font-medium md:text-2xl ${
                      answers[index] === score
                        ? "box-shadow font-black md:font-normal text-white bg-slate-700 dark:bg-white dark:text-black"
                        : "md:bg-white md:text-black"
                    }`}
                    key={score}
                  >
                    <input
                      type="radio"
                      name={`statement-${index}`}
                      value={score}
                      onChange={() => handleChange(index, score)}
                      checked={answers[index] === score}
                      className="sr-only"
                    />
                    {score}
                  </label>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div className="w-full flex items-center gap-4 align-middle mt-10 justify-end">
          {sent && (
            <div className="p-4 bg-green-100 text-green-800 rounded-lg">
              Svarene er registrert!
            </div>
          )}
          <button
            type="button"
            className="cursor-pointer px-12 py-3 w-fit bg-green-300 text-black font-bold rounded-full hover:bg-green-400 transition-all duration-300 disabled:bg-gray-400"
            onClick={handleSendAnswers}
            disabled={sending || sent}
          >
            {sent ? "Svar sendt!" : sending ? "Sender..." : "Registrer svar"}
          </button>
        </div>
      </form>
    </Suspense>
  );
}

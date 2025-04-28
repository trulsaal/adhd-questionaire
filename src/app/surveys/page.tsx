"use client";

import { useEffect, useState } from "react";
import { createClient } from "@sanity/client";
import { FaPlusCircle } from "react-icons/fa";

interface SurveyResponse {
  _id: string;
  responses: {
    statement: string;
    score: number;
  }[];
  submittedAt: string;
}

export default function MySurveysPage() {
  const [surveys, setSurveys] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your-project-id",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "your-dataset",
    useCdn: false,
    apiVersion: "2023-05-03",
    token: process.env.SANITY_API_TOKEN,
  });

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const query = `*[_type == "surveyResponse"] | order(submittedAt desc) {
          _id,
          responses[] {
            statement,
            score
          },
          submittedAt
        }`;

        const surveysData = await client.fetch(query);
        setSurveys(surveysData);
      } catch (error) {
        console.error("Error fetching surveys:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  if (loading) {
    return <div className="text-white p-10">Loading surveys...</div>;
  }

  return (
    <div className="flex flex-col mx-auto mt-10 gap-4">
      {surveys.length === 0 ? (
        <div className="text-white  p-10">No surveys available</div>
      ) : (
        surveys.map((survey) => (
          <div
            key={survey._id}
            className="md:p-24 rounded-2xl bg-gray-800 gap-4 flex flex-col min-w-[1000px] m-auto"
          >
            <div className="p-4 md:p-0">
              <span className="text-white font-light text-3xl">
                Innsendt:{" "}
                <strong className="text-green-200">
                  {new Date(survey.submittedAt).toLocaleString()}
                </strong>
              </span>
            </div>

            {/* Score 4 Responses */}
            <div className="border-[1px] border-gray-700 rounded-lg p-4">
              <h2 className="text-white">Score 4:</h2>
              {survey.responses
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
              {survey.responses.filter((item) => item.score === 4).length ===
                0 && (
                <p className="text-gray-400 text-sm">No score 4 responses</p>
              )}
            </div>

            {/* Score 3 Responses */}
            <div className="border-[1px] border-gray-700 rounded-lg p-4">
              <h2 className="text-white">Score 3:</h2>
              {survey.responses
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
              {survey.responses.filter((item) => item.score === 3).length ===
                0 && (
                <p className="text-gray-400 text-sm">No score 3 responses</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

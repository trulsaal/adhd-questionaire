"use client";

import { useEffect, useState } from "react";
import sanityClient from "@sanity/client";

// Set up the Sanity client
const client = sanityClient({
  projectId: "your-project-id", // Replace with your project ID
  dataset: "your-dataset", // Replace with your dataset name
  useCdn: true, // Use CDN for faster responses (can be false for real-time updates)
});

interface SurveyResponse {
  _id: string;
  responses: {
    statement: string;
    score: number;
  }[];
  submittedAt: string; // Timestamp when the survey was submitted
}

export default function MySurveysPage() {
  const [surveys, setSurveys] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the surveys from Sanity
    const fetchSurveys = async () => {
      try {
        const query = `*[_type == "surveyResponse"] {
          _id,
          responses,
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
    return <p>Loading your surveys...</p>;
  }

  return (
    <div>
      <h1>Your Survey Responses</h1>
      {surveys.length === 0 ? (
        <p>No surveys found.</p>
      ) : (
        surveys.map((survey) => (
          <div key={survey._id} className="survey-response">
            <p>
              <strong>Submitted on:</strong>{" "}
              {new Date(survey.submittedAt).toLocaleString()}
            </p>
            {survey.responses.map((response, index) => (
              <div key={index} className="survey-answer">
                <p>{response.statement}</p>
                <p>Score: {response.score}</p>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

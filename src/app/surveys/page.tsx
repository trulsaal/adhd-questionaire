"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@sanity/client";
import { FaPlusCircle, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

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
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
    useCdn: true,
    apiVersion: "2023-05-03",
  });
  console.log("SANITY_PROJECT_ID:", process.env.SANITY_PROJECT_ID);

  const fetchSurveys = useCallback(async () => {
    try {
      const query = `*[_type == "surveyResponse"] | order(submittedAt desc) {
        _id,
        responses[] {
          statement,
          score
        },
        submittedAt
      }`;
      const data = await client.fetch(query);
      setSurveys(data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load surveys");
    } finally {
      setLoading(false);
    }
  }, [client]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this survey?")) return;

    setDeletingId(id);
    try {
      const response = await fetch("/api/deleteSurvey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Delete failed");
      }

      setSurveys((prev) => prev.filter((s) => s._id !== id));
      toast.success("Survey deleted successfully");
    } catch (error: unknown) {
      console.error("Delete error:", error);
      if (error instanceof Error) {
        toast.error(error.message || "Failed to delete survey");
      } else {
        toast.error("Failed to delete survey");
      }
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-white">Alle kartlegginger</h1>

      {surveys.length === 0 ? (
        <div className="text-gray-400 p-8 text-center">
          No surveys available
        </div>
      ) : (
        surveys.map((survey) => (
          <div
            key={survey._id}
            className="relative bg-gray-800 rounded-lg p-6 shadow-lg"
          >
            {/* Delete button */}
            <button
              onClick={() => handleDelete(survey._id)}
              disabled={deletingId === survey._id}
              className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
              aria-label="Delete survey"
            >
              {deletingId === survey._id ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-400" />
              ) : (
                <FaTrash className="text-lg" />
              )}
            </button>

            <div className="mb-4">
              <h2 className="text-lg font-semibold text-white">
                Registrert: {new Date(survey.submittedAt).toLocaleString()}
              </h2>
            </div>

            <div className="space-y-6">
              {/* Score 4 Responses */}
              <div className="border border-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Score 4:</h3>
                {survey.responses.filter((r) => r.score === 4).length > 0 ? (
                  survey.responses
                    .filter((r) => r.score === 4)
                    .map((response, idx) => (
                      <div key={idx} className="flex items-center gap-2 py-1">
                        <FaPlusCircle className="text-pink-400 flex-shrink-0" />
                        <p className="text-white text-sm">
                          {response.statement}
                        </p>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-400 text-sm">No score 4 responses</p>
                )}
              </div>

              {/* Score 3 Responses */}
              <div className="border border-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Score 3:</h3>
                {survey.responses.filter((r) => r.score === 3).length > 0 ? (
                  survey.responses
                    .filter((r) => r.score === 3)
                    .map((response, idx) => (
                      <div key={idx} className="flex items-center gap-2 py-1">
                        <FaPlusCircle className="text-pink-300 flex-shrink-0" />
                        <p className="text-white text-sm">
                          {response.statement}
                        </p>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-400 text-sm">No score 3 responses</p>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

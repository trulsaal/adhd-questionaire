"use client";

import { client } from "@/sanity/lib/client";
import { useEffect, useState } from "react";

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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare data to submit to backend
    const response = {
      surveyId: surveyData._id, // Survey ID (can be used to associate answers)
      answers: Object.keys(answers).map((index) => ({
        statement: surveyData.statements[index],
        score: answers[index],
      })),
    };

    // Example: Send response to your API
    console.log("Survey Response:", response);

    // Reset answers
    setAnswers({});
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{surveyData.title}</h1>

      {surveyData.statements.map((statement, index) => (
        <div key={index}>
          <h3>{statement}</h3>
          <div>
            {[0, 1, 2, 3, 4].map((score) => (
              <label key={score}>
                <input
                  type="radio"
                  name={`statement-${index}`}
                  value={score}
                  onChange={() => handleChange(index, score)}
                  checked={answers[index] === score}
                />
                {score}
              </label>
            ))}
          </div>
        </div>
      ))}

      <button type="submit">Submit Survey</button>
    </form>
  );
}

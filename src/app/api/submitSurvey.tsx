import type { NextApiRequest, NextApiResponse } from "next";
import sanityClient from "@sanity/client";

// Set up the Sanity client
const client = sanityClient({
  projectId: "your-project-id", // Replace with your project ID
  dataset: "your-dataset", // Replace with your dataset name
  useCdn: true, // Use CDN for faster responses (can be false for real-time updates)
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  try {
    const { responses } = req.body;

    // Validate that responses are provided
    if (!responses || responses.length === 0) {
      return res.status(400).json({ message: "No responses provided" });
    }

    // Create a document to save in Sanity
    const newSurveyResponse = {
      _type: "surveyResponse",
      responses, // The survey responses
      submittedAt: new Date().toISOString(), // Automatically assign the current time as the submitted date
    };

    // Create the new document in Sanity
    await client.create(newSurveyResponse);

    return res.status(200).json({ message: "Survey submitted successfully!" });
  } catch (error) {
    console.error("Error submitting survey:", error);
    return res
      .status(500)
      .json({ message: "Error processing survey submission" });
  }
}

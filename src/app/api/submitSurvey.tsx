// pages/api/submitSurvey.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { surveyId, answers } = req.body;

  console.log("Received survey response:", { surveyId, answers });

  // TODO: Save to database, forward to Sanity, etc.

  res.status(200).json({ message: "Survey submitted successfully" });
}

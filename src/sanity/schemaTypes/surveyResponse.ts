const surveyResponseSchema = {
  name: "surveyResponse",
  title: "Survey Response",
  type: "document",
  fields: [
    {
      name: "survey",
      type: "reference",
      to: [{ type: "survey" }],
    },
    {
      name: "responses",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "statement",
              type: "string",
            },
            {
              name: "score",
              type: "number",
            },
          ],
        },
      ],
    },
    {
      name: "submittedAt",
      type: "datetime", // Store the timestamp when the survey is submitted
    },
  ],
};

export default surveyResponseSchema;

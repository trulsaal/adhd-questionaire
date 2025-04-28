const surveyResponseSchema = {
  name: "surveyResponse",
  type: "document",
  title: "Survey Response",
  fields: [
    {
      name: "responses",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "statement", type: "string" },
            { name: "score", type: "number" },
          ],
        },
      ],
    },
    {
      name: "submittedAt",
      type: "datetime",
      title: "Submitted At",
    },
  ],
};

export default surveyResponseSchema;

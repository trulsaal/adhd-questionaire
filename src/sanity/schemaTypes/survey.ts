const surveySchema = {
  name: "survey",
  title: "Survey",
  type: "document",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Survey Title",
    },
    {
      name: "statements",
      type: "array",
      title: "Survey Statements",
      of: [
        {
          type: "string", // Each statement is a simple string
          title: "Statement",
        },
      ],
    },
  ],
};

export default surveySchema;

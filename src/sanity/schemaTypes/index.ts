import { type SchemaTypeDefinition } from "sanity";
import survey from "./survey";
import surveyResponse from "./surveyResponse";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [survey, surveyResponse],
};

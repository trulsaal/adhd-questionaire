/**
 * This configuration file lets you run `$ sanity [command]` in this folder
 * Go to https://www.sanity.io/docs/cli to learn more.
 **/
import { defineCliConfig } from "sanity/cli";
const token = process.env.NEXT_PUBLIC_SANITY_TOKEN;
if (!token) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SANITY_TOKEN");
}
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
export default defineCliConfig({ api: { projectId, dataset } });

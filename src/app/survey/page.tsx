"use client";
import { Suspense } from "react";
import SurveyClient from "./SurveyClient";

export default function SurveyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SurveyClient />
    </Suspense>
  );
}

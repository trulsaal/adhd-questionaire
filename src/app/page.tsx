import SurveyComponent from "./components/SurveyComponent";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-fit w-fit p-4 bg-gray-900 text-slate-100 m-auto rounded-lg">
      <SurveyComponent></SurveyComponent>
    </div>
  );
}

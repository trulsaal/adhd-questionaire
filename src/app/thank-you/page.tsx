// ThankYou.tsx
"use client";
import { useEffect } from "react";

export default function ThankYouPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.close(); // Or do nothing if you don't want it to close
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-10 text-white text-center">
      <h1 className="text-3xl font-bold mb-4">Takk for at du svarte!</h1>
      <p className="text-lg">Denne siden lukkes automatisk om 10 sekunder.</p>
    </div>
  );
}

import React from "react";
import { BlobBackground } from "../components/BlobBackground";

export function Portfolio() {
  return (
    <div className="relative min-h-screen px-6 py-16 md:px-12 lg:px-16">
      <BlobBackground />
      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-white">Portfolio</h2>
        <p className="mt-4 text-slate-300">Coming soon.</p>
      </div>
    </div>
  );
}

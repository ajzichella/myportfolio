import React from "react";

type GrainientProps = {
  color1: string;
  color2: string;
  color3: string;
  timeSpeed?: number;
  colorBalance?: number;
  warpStrength?: number;
  warpFrequency?: number;
  warpSpeed?: number;
  warpAmplitude?: number;
  blendAngle?: number;
  blendSoftness?: number;
  rotationAmount?: number;
  noiseScale?: number;
  grainAmount?: number;
  grainScale?: number;
  grainAnimated?: boolean;
  contrast?: number;
  gamma?: number;
  saturation?: number;
  centerX?: number;
  centerY?: number;
  zoom?: number;
  className?: string;
};

/**
 * Lightweight "Grainient"-style background layer.
 * Exposes the same prop surface used in UI snippets.
 */
export function Grainient({
  color1,
  color2,
  color3,
  timeSpeed = 1,
  colorBalance = 0.02,
  warpStrength = 1.2,
  warpFrequency = 5,
  warpSpeed = 2,
  warpAmplitude = 50,
  blendAngle = 0,
  blendSoftness = 0.05,
  rotationAmount = 500,
  noiseScale = 0,
  grainAmount = 0.08,
  grainScale = 2.2,
  grainAnimated = false,
  contrast = 1.25,
  gamma = 1,
  saturation = 1,
  centerX = 0,
  centerY = 0,
  zoom = 1,
  className = "",
}: GrainientProps) {
  const c1Stop = `${Math.max(22, 38 - colorBalance * 100)}%`;
  const c2Stop = `${Math.max(26, 42 + colorBalance * 100)}%`;
  const c3Stop = `${Math.max(30, 52 + colorBalance * 100)}%`;

  const style = {
    ["--grainient-c1" as string]: color1,
    ["--grainient-c2" as string]: color2,
    ["--grainient-c3" as string]: color3,
    ["--grainient-c1-stop" as string]: c1Stop,
    ["--grainient-c2-stop" as string]: c2Stop,
    ["--grainient-c3-stop" as string]: c3Stop,
    ["--grainient-angle" as string]: `${blendAngle}deg`,
    ["--grainient-softness" as string]: `${blendSoftness}`,
    ["--grainient-zoom" as string]: `${zoom}`,
    ["--grainient-cx" as string]: `${50 + centerX * 50}%`,
    ["--grainient-cy" as string]: `${50 + centerY * 50}%`,
    ["--grainient-speed" as string]: `${Math.max(16, 34 / Math.max(0.2, timeSpeed))}s`,
    ["--grainient-rot-speed" as string]: `${Math.max(24, 90 / Math.max(0.2, timeSpeed))}s`,
    ["--grainient-rot" as string]: `${Math.max(80, rotationAmount)}deg`,
    ["--grainient-warp-strength" as string]: `${warpStrength}`,
    ["--grainient-warp-freq" as string]: `${warpFrequency}`,
    ["--grainient-warp-speed" as string]: `${warpSpeed}s`,
    ["--grainient-warp-amp" as string]: `${warpAmplitude}px`,
    ["--grainient-grain-alpha" as string]: `${grainAmount}`,
    ["--grainient-grain-size" as string]: `${Math.max(1, grainScale + noiseScale)}`,
    ["--grainient-contrast" as string]: `${contrast}`,
    ["--grainient-gamma" as string]: `${gamma}`,
    ["--grainient-saturation" as string]: `${saturation}`,
    ["--grainient-grain-anim" as string]: grainAnimated ? "grainient-noise 1.6s steps(8) infinite" : "none",
  } as React.CSSProperties;

  return <div className={`grainient ${className}`} style={style} aria-hidden />;
}


import { motion } from "motion/react";

export function BlobBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute rounded-full blur-[120px] opacity-[0.15]"
        style={{
          width: 600,
          height: 600,
          left: "15%",
          top: "18%",
          background: "#5227FF",
        }}
        animate={{
          x: [0, 80, -60, 40, 0],
          y: [0, -30, 70, -20, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute rounded-full blur-[120px] opacity-[0.15]"
        style={{
          width: 500,
          height: 500,
          left: "55%",
          top: "35%",
          background: "#00aeef",
        }}
        animate={{
          x: [0, -70, 55, -45, 0],
          y: [0, 65, -50, 40, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute rounded-full blur-[120px] opacity-[0.12]"
        style={{
          width: 550,
          height: 550,
          left: "72%",
          top: "68%",
          background: "#4ba6b3",
        }}
        animate={{
          x: [0, 50, -75, 35, 0],
          y: [0, -45, 55, -40, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

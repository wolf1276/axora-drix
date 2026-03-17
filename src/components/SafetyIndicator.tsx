"use client";

import { motion } from "framer-motion";

interface SafetyIndicatorProps {
  safe: boolean;
  reasons: string[];
}

export default function SafetyIndicator({ safe, reasons }: SafetyIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
      className={`border-2 border-ink shadow-brutal ${safe ? "bg-safe/5" : "bg-danger/5"}`}
    >
      {/* Big Decision */}
      <div className={`p-8 text-center border-b-2 border-ink ${safe ? "glow-safe" : "glow-danger"}`}>
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Status dot */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <span
              className={`inline-block w-4 h-4 pulse-dot ${safe ? "bg-safe" : "bg-danger"}`}
            />
            <span className="text-xs font-medium uppercase tracking-widest text-ink/40">
              Flight Status
            </span>
          </div>

          <p className={`font-heading font-bold text-5xl md:text-6xl tracking-tight ${safe ? "text-safe" : "text-danger"}`}>
            {safe ? "SAFE TO FLY" : "NOT SAFE"}
          </p>

          <p className="text-sm text-ink/50 mt-3">
            {safe
              ? "All conditions are within acceptable limits."
              : `${reasons.length} issue${reasons.length > 1 ? "s" : ""} detected.`}
          </p>
        </motion.div>
      </div>

      {/* Reasons (if not safe) */}
      {!safe && reasons.length > 0 && (
        <div className="px-6 py-4 space-y-2">
          {reasons.map((reason, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-danger font-bold mt-0.5">✕</span>
              <span className="text-ink/70">{reason}</span>
            </div>
          ))}
        </div>
      )}

      {safe && (
        <div className="px-6 py-4 flex items-center gap-2 text-sm text-safe/80">
          <span className="text-safe font-bold">✓</span>
          <span>Wind, precipitation, and visibility conditions all clear.</span>
        </div>
      )}
    </motion.div>
  );
}

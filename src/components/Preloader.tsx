import { useEffect, useState } from "react";
import logoAsset from "@/assets/TN LOGO.jpeg";

/**
 * Preloader component with a premium, human-designed dark glassmorphic interface
 * featuring concentric rotating SVG tracks, ambient breathing glows, and a smooth progress bar.
 */
export default function Preloader({ minDuration = 1400 }: { minDuration?: number }) {
  const [show, setShow] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFading(true), minDuration);
    const t2 = setTimeout(() => setShow(false), minDuration + 600);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [minDuration]);

  if (!show) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-tr from-[#f8fafc] via-slate-50 to-[#f1f5f9] transition-opacity duration-600 ease-out ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Custom Keyframe Styles */}
      <style>{`
        @keyframes preload-progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes logo-breathe {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 4px 15px rgba(212, 160, 23, 0.15)); }
          50% { transform: scale(1.03); filter: drop-shadow(0 6px 22px rgba(212, 160, 23, 0.3)); }
        }
        @keyframes ambient-pulse {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          50% { opacity: 0.65; transform: scale(1.05); }
        }
      `}</style>

      {/* Ambient background glows */}
      <div
        className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-[#0a3a1b]/10 via-[#d4a017]/8 to-[#cf1020]/8 blur-[90px]"
        style={{ animation: "ambient-pulse 5s ease-in-out infinite" }}
      />

      {/* Glassmorphic Loader Card */}
      <div className="relative z-10 flex flex-col items-center p-8 rounded-3xl bg-white/85 backdrop-blur-xl border border-slate-100 shadow-[0_20px_50px_rgba(15,23,42,0.06)] max-w-sm w-full mx-4">
        {/* Ring & Logo Area */}
        <div className="relative w-36 h-36 flex items-center justify-center mb-6">
          {/* Concentric rotating SVG rings representing connectivity */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            {/* Outer Slow Track (Green) */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#0d5c2c"
              strokeWidth="1.2"
              strokeDasharray="10 35 45 10"
              opacity="0.65"
              style={{
                transformOrigin: "center",
                animation: "spin-slow 8s linear infinite",
              }}
            />
            {/* Inner Reverse Track (Gold) */}
            <circle
              cx="50"
              cy="50"
              r="41"
              fill="none"
              stroke="#D4A017"
              strokeWidth="1.2"
              strokeDasharray="25 15 5 15"
              opacity="0.8"
              style={{
                transformOrigin: "center",
                animation: "spin-reverse 5s linear infinite",
              }}
            />
            {/* Tiny accent pulse dots */}
            <circle
              cx="50"
              cy="9"
              r="2.5"
              fill="#CF1020"
              style={{
                transformOrigin: "center",
                animation: "spin-slow 4s cubic-bezier(0.4, 0, 0.2, 1) infinite",
              }}
            />
          </svg>

          {/* Logo Frame */}
          <div
            className="w-24 h-24 rounded-full overflow-hidden bg-white border border-slate-100 p-1 flex items-center justify-center shadow-md"
            style={{ animation: "logo-breathe 3s ease-in-out infinite" }}
          >
            <img
              src={logoAsset}
              alt="TN Logo"
              className="w-full h-full rounded-full object-contain"
            />
          </div>
        </div>

        {/* Text indicators */}
        <div className="space-y-1 text-center">
          <h2 className="text-[11px] uppercase tracking-[0.25em] font-black text-slate-900">
            TN Universities Connect
          </h2>
          <p className="text-[8px] uppercase tracking-[0.2em] text-slate-500 font-bold">
            Guide • Work • Inspire
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden mt-6">
          <div
            className="h-full bg-gradient-to-r from-[#CF1020] via-[#D4A017] to-[#0a3a1b] rounded-full"
            style={{
              animation: `preload-progress ${minDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

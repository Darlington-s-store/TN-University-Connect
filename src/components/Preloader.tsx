import { useEffect, useState } from "react";
import logoAsset from "@/assets/TN LOGO.jpeg";

/**
 * Shows the brand logo on a clean background while the app boots.
 * Renders logo ONLY (no app text), then fades out smoothly.
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
      className={`fixed inset-0 z-[9999] grid place-items-center bg-white transition-opacity duration-500 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Subtle Ghana flag accent ring */}
      <div className="relative">
        <div className="absolute inset-0 -m-6 rounded-full flag-stripe opacity-90 blur-[2px] animate-[spin_6s_linear_infinite]" />
        <div className="absolute inset-0 -m-2 rounded-full bg-white" />
        <img
          src={logoAsset}
          alt=""
          className="relative h-36 w-36 sm:h-44 sm:w-44 rounded-full object-contain animate-[logoPulse_1.6s_ease-in-out_infinite]"
        />
      </div>
    </div>
  );
}

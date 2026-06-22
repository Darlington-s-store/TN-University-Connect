import { ReactNode } from "react";
import heroVideo from "@/assets/hero-video.mp4.asset.json";
import heroBg from "@/assets/hero-bg.jpg";

/**
 * Shared video-background wrapper for authentication pages
 * (Login, Register, Admin Login, Forgot Password, Reset Password).
 */
export default function AuthVideoBackground({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster={heroBg}
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={heroVideo.url} type="video/mp4" />
      </video>

      {/* Dark gradient overlay so content stays readable */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/85 via-secondary/75 to-slate-950/85" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,107,63,0.25),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(252,209,22,0.18),transparent_55%)]" />

      {/* Ghana flag accent */}
      <div className="absolute top-0 left-0 right-0 h-1 flag-stripe z-10" />

      {/* Foreground content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">
        {children}
      </div>
    </div>
  );
}

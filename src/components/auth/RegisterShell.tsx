import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import heroVideo from "@/assets/hero-video.mp4.asset.json";
import heroBg from "@/assets/hero-bg.jpg";
import Logo from "@/components/Logo";

/**
 * RegisterShell — intentionally different from AuthShell (Login uses split-screen
 * with a static graphic; Register uses a centered glass card over a video bg).
 */
export default function RegisterShell({
  title,
  subtitle,
  step,
  totalSteps = 2,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  step?: number;
  totalSteps?: number;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col bg-secondary text-white overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={heroBg}
          className="h-full w-full object-cover"
          aria-hidden="true"
        >
          <source src={heroVideo.url} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-secondary/85" />
        <div className="absolute inset-0 bg-gradient-to-br from-ghana-green/25 via-transparent to-ghana-red/20" />
        <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[480px] h-[480px] rounded-full bg-ghana-red/15 blur-3xl" />
      </div>

      {/* Flag accent */}
      <div className="absolute top-0 inset-x-0 h-1 z-30 bg-gradient-to-r from-ghana-red via-ghana-gold to-ghana-green" />

      {/* Header */}
      <header className="relative z-10 container mx-auto px-6 pt-8 flex items-center justify-between">
        <Logo variant="light" />
        <Link
          to="/"
          className="text-xs text-white/60 hover:text-white transition-colors hidden sm:inline-flex"
        >
          ← Back to home
        </Link>
      </header>

      {/* Center card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-2xl">
          {/* Step badge */}
          {typeof step === "number" && (
            <div className="flex items-center justify-center mb-5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                  Step {step} of {totalSteps}
                </span>
              </div>
            </div>
          )}

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-white via-white to-accent bg-clip-text text-transparent">
                {title}
              </span>
            </h1>
            {subtitle && (
              <p className="mt-3 text-sm sm:text-base text-white/70 max-w-md mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Glass card */}
          <div className="relative rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="p-6 sm:p-10 [&_label]:text-white/85 [&_input]:bg-white/[0.06] [&_input]:border-white/15 [&_input]:text-white [&_input]:placeholder:text-white/40 [&_button[role=combobox]]:bg-white/[0.06] [&_button[role=combobox]]:border-white/15 [&_button[role=combobox]]:text-white">
              {children}
            </div>
          </div>

          {footer && (
            <div className="mt-6 text-center text-sm text-white/70">{footer}</div>
          )}

          <div className="mt-8 text-center">
            <Link to="/" className="text-xs text-white/50 hover:text-white sm:hidden">
              ← Back to home
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} TN Universities Connect
      </footer>
    </div>
  );
}

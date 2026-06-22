import { ReactNode } from "react";
import Logo from "@/components/Logo";
import { CheckCircle2 } from "lucide-react";

export default function RegisterShell({
  title,
  subtitle,
  step,
  totalSteps = 2,
  children,
}: {
  title: string;
  subtitle?: string;
  step?: number;
  totalSteps?: number;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-[45%_55%] bg-slate-50">
      {styleBlock}

      {/* Left panel: Premium Ghanaian Cultural/Brand Panel (Logo Tricolor Gradient) */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-[#fff5f5] via-[#fffdf0] to-[#f0faf4] border-r border-slate-200/80">
        {/* Woven Kente style decorative lines */}
        <div className="absolute inset-0 z-0 opacity-15">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,rgba(212,160,23,0.06)_8px,rgba(212,160,23,0.06)_10px,transparent_10px,transparent_18px,rgba(207,16,32,0.05)_18px,rgba(207,16,32,0.05)_20px)]" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_16px,rgba(15,23,42,0.01)_16px,rgba(15,23,42,0.01)_17px)]" />
        </div>

        {/* Pulsating glow orbs in Logo colors */}
        <div
          className="absolute -top-40 -right-40 w-[450px] h-[450px] rounded-full bg-ghana-gold/12 blur-[120px]"
          style={{ animation: "orb-drift 22s infinite ease-in-out" }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-ghana-red/8 blur-[120px]"
          style={{ animation: "orb-drift 28s infinite ease-in-out reverse" }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-[350px] h-[350px] rounded-full bg-ghana-green/6 blur-[100px]"
          style={{ animation: "orb-drift 30s infinite ease-in-out" }}
        />

        {/* Top brand border */}
        <div className="absolute top-0 inset-x-0 h-1 z-10 bg-gradient-to-r from-ghana-red via-ghana-gold to-ghana-green" />

        {/* Logo */}
        <div className="relative z-10">
          <Logo />
        </div>

        {/* Proverb Showcase */}
        <div className="relative z-10 space-y-8 my-auto">
          <div>
            <h2 className="text-4xl xl:text-5xl font-black leading-none text-slate-900 tracking-tight">
              Akwaaba!
            </h2>
            <p className="mt-3 text-slate-650 text-sm font-semibold leading-relaxed max-w-xs">
              Welcome to the national network connecting academic excellence with opportunity.
            </p>
          </div>

          {/* Ghana star SVG */}
          <div className="relative">
            <svg
              viewBox="0 0 100 100"
              className="w-14 h-14 text-ghana-gold opacity-95 drop-shadow-[0_2px_8px_rgba(212,160,23,0.2)]"
              fill="currentColor"
            >
              <polygon points="50,5 61,38 97,38 68,60 79,95 50,73 21,95 32,60 3,38 39,38" />
            </svg>
          </div>

          {/* Sankofa quote card */}
          <blockquote className="border-l-2 border-ghana-gold/50 pl-5 max-w-xs py-1">
            <p className="text-sm text-slate-700 italic leading-relaxed font-semibold">
              "Se wo were fi na wosan kofa a yenkyi."
            </p>
            <footer className="mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              — Go back and fetch what you forgot
            </footer>
          </blockquote>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-slate-400 font-bold">
          © {new Date().getFullYear()} TN Universities Connect. All rights reserved.
        </div>
      </div>

      {/* Right panel: Form Section */}
      <div className="flex flex-col justify-center px-6 py-10 sm:px-16 lg:px-20 bg-background relative overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden mb-6 flex items-center justify-between border-b pb-4">
          <Logo />
          <div className="h-0.5 w-16 bg-gradient-to-r from-ghana-red via-ghana-gold to-ghana-green" />
        </div>

        <div className="max-w-md w-full mx-auto relative z-10">
          {/* Step Indicator */}
          {typeof step === "number" && (
            <div className="flex items-center justify-between mb-8 pb-4 border-b">
              {Array.from({ length: totalSteps }).map((_, idx) => {
                const stepNum = idx + 1;
                const isCompleted = step > stepNum;
                const isActive = step === stepNum;
                const labels = [
                  ["Account", "Details"],
                  ["Verify", "Email OTP"],
                ];

                return (
                  <div key={stepNum} className="flex items-center flex-1 last:flex-none">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                          isCompleted
                            ? "bg-primary/20 text-primary border border-primary/30"
                            : isActive
                              ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,107,45,0.25)]"
                              : "bg-muted text-muted-foreground border"
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : stepNum}
                      </div>
                      <div className="text-left leading-none">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider block ${
                            stepNum <= step ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {labels[idx][0]}
                        </span>
                        <span className="text-[8px] text-muted-foreground uppercase tracking-widest mt-0.5 block font-medium">
                          {labels[idx][1]}
                        </span>
                      </div>
                    </div>

                    {idx < totalSteps - 1 && (
                      <div
                        className={`h-0.5 flex-1 mx-4 rounded-full transition-all duration-500 ${
                          step > stepNum ? "bg-primary/40" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Form Title & Subtitle */}
          <div className="space-y-2 mb-6">
            <h1 className="text-3xl font-bold text-foreground tracking-tight leading-none">
              {title}
            </h1>
            {subtitle && (
              <p className="text-muted-foreground text-sm leading-relaxed">{subtitle}</p>
            )}
          </div>

          {/* Render children form content */}
          <div className="relative">{children}</div>
        </div>
      </div>
    </div>
  );
}

// Inline animation styles
const styleBlock = (
  <style
    dangerouslySetInnerHTML={{
      __html: `
    @keyframes orb-drift {
      0%, 100% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(15px, -15px) scale(1.05); }
    }
  `,
    }}
  />
);

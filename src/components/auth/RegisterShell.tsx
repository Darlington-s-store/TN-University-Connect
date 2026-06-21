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
    <div className="min-h-screen grid lg:grid-cols-[45%_55%] bg-[#080d19]">
      {styleBlock}

      {/* Left panel: Premium Ghanaian Cultural/Brand Panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-[#031c0e] via-[#083018] to-[#010e07] border-r border-white/[0.04]">
        
        {/* Woven Kente style decorative lines */}
        <div className="absolute inset-0 z-0 opacity-15">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,rgba(212,160,23,0.15)_8px,rgba(212,160,23,0.15)_10px,transparent_10px,transparent_18px,rgba(207,16,32,0.15)_18px,rgba(207,16,32,0.15)_20px)]" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_16px,rgba(255,255,255,0.02)_16px,rgba(255,255,255,0.02)_17px)]" />
        </div>

        {/* Pulsating glow orbs */}
        <div 
          className="absolute -top-40 -right-40 w-[450px] h-[450px] rounded-full bg-ghana-gold/5 blur-[120px]"
          style={{ animation: "orb-drift 22s infinite ease-in-out" }}
        />
        <div 
          className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-ghana-green/10 blur-[120px]"
          style={{ animation: "orb-drift 28s infinite ease-in-out reverse" }}
        />

        {/* Top brand border */}
        <div className="absolute top-0 inset-x-0 h-1 z-10 bg-gradient-to-r from-ghana-red via-ghana-gold to-ghana-green" />

        {/* Logo */}
        <div className="relative z-10">
          <Logo variant="light" />
        </div>

        {/* Proverb Showcase */}
        <div className="relative z-10 space-y-8 my-auto">
          <div>
            <h2 className="text-4xl xl:text-5xl font-black leading-none text-white tracking-tight">
              Akwaaba!
            </h2>
            <p className="mt-3 text-slate-350 text-sm font-medium leading-relaxed max-w-xs">
              Welcome to the national network connecting academic excellence with opportunity.
            </p>
          </div>

          {/* Ghana star SVG */}
          <div className="relative">
            <svg
              viewBox="0 0 100 100"
              className="w-14 h-14 text-ghana-gold opacity-90 drop-shadow-[0_0_12px_rgba(212,160,23,0.3)]"
              fill="currentColor"
            >
              <polygon points="50,5 61,38 97,38 68,60 79,95 50,73 21,95 32,60 3,38 39,38" />
            </svg>
          </div>

          {/* Sankofa quote card */}
          <blockquote className="border-l-2 border-ghana-gold/50 pl-5 max-w-xs py-1">
            <p className="text-sm text-slate-300 italic leading-relaxed">
              "Se wo were fi na wosan kofa a yenkyi."
            </p>
            <footer className="mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              — Go back and fetch what you forgot
            </footer>
          </blockquote>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-slate-500 font-medium">
          © {new Date().getFullYear()} TN Universities Connect. All rights reserved.
        </div>
      </div>

      {/* Right panel: Modern Form Section */}
      <div className="flex flex-col justify-center px-6 py-10 sm:px-16 lg:px-20 bg-gradient-to-tr from-[#050912] via-[#09101f] to-[#040810] relative overflow-hidden">
        
        {/* Mobile Header */}
        <div className="lg:hidden mb-6 flex items-center justify-between border-b border-white/[0.05] pb-4">
          <Logo variant="light" />
          <div className="h-0.5 w-16 bg-gradient-to-r from-ghana-red via-ghana-gold to-ghana-green" />
        </div>

        <div className="max-w-md w-full mx-auto relative z-10">
          
          {/* Step Indicator */}
          {typeof step === "number" && (
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.04]">
              
              {/* Step 1: Account details */}
              <div className="flex items-center gap-3">
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-300 ${
                    step > 1
                      ? "bg-ghana-green/20 text-ghana-green border border-ghana-green/30"
                      : "bg-[#43a047] text-white shadow-[0_0_15px_rgba(67,160,71,0.25)]"
                  }`}
                >
                  {step > 1 ? <CheckCircle2 className="h-4.5 w-4.5" /> : "1"}
                </div>
                <div className="text-left leading-none">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider block ${
                      step >= 1 ? "text-white" : "text-slate-500"
                    }`}
                  >
                    Account
                  </span>
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest mt-0.5 block font-bold">Details</span>
                </div>
              </div>

              {/* Connector line */}
              <div
                className={`h-0.5 flex-1 mx-4 rounded-full transition-all duration-500 ${
                  step > 1 ? "bg-ghana-green/40" : "bg-white/[0.04]"
                }`}
              />

              {/* Step 2: Verification */}
              <div className="flex items-center gap-3">
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-300 ${
                    step === 2
                      ? "bg-[#43a047] text-white shadow-[0_0_15px_rgba(67,160,71,0.25)]"
                      : "bg-white/[0.03] text-slate-500 border border-white/[0.05]"
                  }`}
                >
                  2
                </div>
                <div className="text-left leading-none">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider block ${
                      step === 2 ? "text-white" : "text-slate-500"
                    }`}
                  >
                    Verify
                  </span>
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest mt-0.5 block font-bold">Email OTP</span>
                </div>
              </div>
            </div>
          )}

          {/* Form Title & Subtitle */}
          <div className="space-y-2 mb-6">
            <h1 className="text-3xl font-black text-white tracking-tight leading-none">
              {title}
            </h1>
            {subtitle && (
              <p className="text-slate-400 text-sm leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Render children form content */}
          <div className="relative">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline animation styles
const styleBlock = (
  <style dangerouslySetInnerHTML={{ __html: `
    @keyframes orb-drift {
      0%, 100% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(15px, -15px) scale(1.05); }
    }
  `}} />
);

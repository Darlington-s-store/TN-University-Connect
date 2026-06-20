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
    <div className="min-h-screen grid lg:grid-cols-[42%_58%]">
      {/* ── Left panel: Ghanaian cultural splash ── */}
      <div className="hidden lg:flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#0a2810] via-[#0d3315] to-[#041a0a] p-12">
        {/* Kente-inspired woven stripe pattern */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_6px,#D4A017_6px,#D4A017_8px,transparent_8px,transparent_14px,#CF1020_14px,#CF1020_16px,transparent_16px,transparent_22px)]" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_12px,rgba(255,255,255,0.03)_12px,rgba(255,255,255,0.03)_13px)]" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,rgba(212,160,23,0.04)_20px,rgba(212,160,23,0.04)_21px)]" />
        </div>

        {/* Glow orbs */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-ghana-gold/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-ghana-red/10 blur-3xl" />

        {/* Ghana flag top border */}
        <div className="absolute top-0 inset-x-0 h-1.5 z-10 bg-gradient-to-r from-ghana-red via-ghana-gold to-ghana-green" />

        {/* Logo */}
        <div className="relative z-10">
          <Logo variant="light" />
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          {/* Akwaaba */}
          <div>
            <h2 className="text-5xl font-black tracking-tight text-white leading-[1.1]">
              Akwaaba!
            </h2>
            <p className="mt-3 text-lg text-white/70 max-w-sm leading-relaxed font-medium">
              Welcome to Ghana's national university network
            </p>
          </div>

          {/* Ghana Star */}
          <svg
            viewBox="0 0 100 100"
            className="w-16 h-16 text-ghana-gold opacity-80"
            fill="currentColor"
          >
            <polygon points="50,5 61,38 97,38 68,60 79,95 50,73 21,95 32,60 3,38 39,38" />
          </svg>

          {/* Sankofa Proverb */}
          <blockquote className="border-l-4 border-ghana-gold/60 pl-5 max-w-xs">
            <p className="text-sm text-white/80 italic leading-relaxed">
              "Se wo were fi na wosan kofa a yenkyi."
            </p>
            <footer className="mt-1.5 text-xs text-white/50 font-medium tracking-wide">
              — It is not taboo to go back and fetch what you forgot
            </footer>
          </blockquote>

          {/* Flag colour dots */}
          <div className="flex gap-2">
            <span className="h-2 w-10 rounded-full bg-ghana-red" />
            <span className="h-2 w-10 rounded-full bg-ghana-gold" />
            <span className="h-2 w-10 rounded-full bg-ghana-green" />
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/30">
          © {new Date().getFullYear()} TN Universities Connect
        </div>
      </div>

      {/* ── Right panel: form area ── */}
      <div className="flex flex-col justify-center px-6 py-10 sm:px-14 lg:px-18 bg-gradient-to-br from-white via-slate-50 to-white relative">
        {/* Logo on mobile */}
        <div className="lg:hidden mb-6">
          <Logo />
        </div>

        {/* Ghana flag top border on mobile */}
        <div className="lg:hidden absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-ghana-red via-ghana-gold to-ghana-green" />

        <div className="max-w-md w-full mx-auto">
          {/* Flag accent bar above form */}
          <div className="hidden lg:flex gap-1.5 mb-6">
            <span className="h-1 w-8 rounded-full bg-ghana-red" />
            <span className="h-1 w-8 rounded-full bg-ghana-gold" />
            <span className="h-1 w-8 rounded-full bg-ghana-green" />
          </div>

          {/* Step indicator */}
          {typeof step === "number" && (
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
              {/* Step 1: Account details */}
              <div className="flex items-center gap-2.5">
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-extrabold transition-all duration-300 ${
                    step > 1
                      ? "bg-ghana-green/10 text-ghana-green border border-ghana-green/20"
                      : "bg-primary text-primary-foreground shadow-sm ring-4 ring-primary/10"
                  }`}
                >
                  {step > 1 ? <CheckCircle2 className="h-4.5 w-4.5" /> : "1"}
                </div>
                <div className="text-left">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider block leading-none ${
                      step >= 1 ? "text-slate-800 font-extrabold" : "text-slate-400"
                    }`}
                  >
                    Account
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium">Details</span>
                </div>
              </div>

              {/* Connector line */}
              <div
                className={`h-0.5 flex-1 mx-3 rounded-full transition-all duration-500 ${
                  step > 1 ? "bg-ghana-green/30" : "bg-slate-100"
                }`}
              />

              {/* Step 2: Verification */}
              <div className="flex items-center gap-2.5">
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-extrabold transition-all duration-300 ${
                    step === 2
                      ? "bg-primary text-primary-foreground shadow-sm ring-4 ring-primary/10"
                      : "bg-slate-50 text-slate-400 border border-slate-200"
                  }`}
                >
                  2
                </div>
                <div className="text-left">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider block leading-none ${
                      step === 2 ? "text-slate-800 font-extrabold" : "text-slate-400"
                    }`}
                  >
                    Verify
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium">Email OTP</span>
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-slate-500 leading-relaxed">{subtitle}</p>}

          <div className="mt-8">{children}</div>
        </div>

        <div className="mt-10 text-center lg:hidden">
          <a href="/" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
            ← Back to home
          </a>
        </div>
      </div>
    </div>
  );
}

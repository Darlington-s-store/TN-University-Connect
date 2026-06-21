import { ReactNode } from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-[45%_55%] bg-[#080d19]">
      {styleBlock}

      {/* Left panel: Premium Brand Splash */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-[#070c18] via-[#0f172a] to-[#02050b] border-r border-white/[0.04]">
        
        {/* Animated ambient glow orbs */}
        <div 
          className="absolute -top-40 -right-40 w-[450px] h-[450px] rounded-full bg-ghana-gold/5 blur-[120px]"
          style={{ animation: "orb-drift 20s infinite ease-in-out" }}
        />
        <div 
          className="absolute -bottom-40 -left-40 w-[450px] h-[450px] rounded-full bg-ghana-red/5 blur-[120px]"
          style={{ animation: "orb-drift 25s infinite ease-in-out reverse" }}
        />

        {/* Minimal Dot Matrix overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.02] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />

        {/* Top Ghana gradient bar */}
        <div className="absolute top-0 inset-x-0 h-1 z-10 bg-gradient-to-r from-ghana-red via-ghana-gold to-ghana-green" />

        {/* Logo */}
        <div className="relative z-10">
          <Logo variant="light" />
        </div>

        {/* Text Showcase */}
        <div className="relative z-10 space-y-6 my-auto">
          <h2 className="text-4xl xl:text-5xl font-black leading-[1.15] text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-100 to-slate-400">
            Guide.<br />Work.<br />Inspire.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-medium">
            Join a nationwide community of students, academic leaders, and distinguished alumni shaping the future of Ghana.
          </p>

          {/* Minimal glowing kente accent */}
          <div className="flex gap-2 pt-2">
            <span className="h-1 w-8 rounded-full bg-ghana-red shadow-[0_0_8px_rgba(207,16,32,0.4)] animate-pulse" />
            <span className="h-1 w-8 rounded-full bg-ghana-gold shadow-[0_0_8px_rgba(212,160,23,0.4)] animate-pulse [animation-delay:0.2s]" />
            <span className="h-1 w-8 rounded-full bg-ghana-green shadow-[0_0_8px_rgba(13,92,44,0.4)] animate-pulse [animation-delay:0.4s]" />
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-slate-500 font-medium">
          © {new Date().getFullYear()} TN Universities Connect. All rights reserved.
        </div>
      </div>

      {/* Right panel: Modern Form Section */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-16 lg:px-20 bg-gradient-to-tr from-[#050912] via-[#09101f] to-[#040810] relative overflow-hidden">
        
        {/* Mobile Header */}
        <div className="lg:hidden mb-8 flex items-center justify-between border-b border-white/[0.05] pb-4">
          <Logo variant="light" />
          <div className="h-0.5 w-16 bg-gradient-to-r from-ghana-red via-ghana-gold to-ghana-green" />
        </div>

        <div className="max-w-md w-full mx-auto relative z-10">
          
          {/* Header */}
          <div className="space-y-2 mb-8">
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

          {/* Bottom link info */}
          {footer && (
            <div className="mt-8 text-xs text-slate-500 text-center font-semibold">
              {footer}
            </div>
          )}

          <div className="mt-8 text-center">
            <Link 
              to="/" 
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors duration-300 font-bold uppercase tracking-wider"
            >
              <span>← Back to home</span>
            </Link>
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
      50% { transform: translate(20px, -20px) scale(1.1); }
    }
  `}} />
);

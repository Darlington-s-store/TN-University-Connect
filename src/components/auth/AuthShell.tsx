import { ReactNode } from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import heroVideo from "@/assets/hero-video.mp4.asset.json";
import heroBg from "@/assets/hero-bg.jpg";

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
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/85 via-secondary/75 to-slate-950/90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,107,63,0.25),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(252,209,22,0.18),transparent_55%)]" />
      <div className="absolute top-0 left-0 right-0 h-1 flag-stripe z-10" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="flex justify-center">
            <Logo variant="light" />
          </div>

          <div className="bg-card/95 backdrop-blur border border-white/10 shadow-2xl rounded-2xl overflow-hidden">
            <div className="p-6 sm:p-8 space-y-5">
              <div className="text-center space-y-1.5">
                <h1 className="text-2xl font-bold text-foreground tracking-tight">{title}</h1>
                {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
              </div>
              {children}
              {footer && <div className="text-center text-sm text-muted-foreground">{footer}</div>}
            </div>
          </div>

          <div className="text-center">
            <Link to="/" className="text-xs text-white/80 hover:text-white font-medium">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

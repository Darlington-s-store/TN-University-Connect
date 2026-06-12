import logoAsset from "@/assets/logo.jpeg.asset.json";
import { Link } from "react-router-dom";

export default function Logo({ className = "", showText = true, variant = "default" }: { className?: string; showText?: boolean; variant?: "default" | "light" }) {
  const text = variant === "light" ? "text-white" : "text-secondary";
  const sub = variant === "light" ? "text-white/70" : "text-muted-foreground";
  return (
    <Link to="/" className={`flex items-center gap-3 group ${className}`}>
      <img
        src={logoAsset.url}
        alt="TN Universities Connect logo"
        className="h-12 w-12 rounded-lg object-cover shadow-soft transition-smooth group-hover:scale-105"
      />
      {showText && (
        <div className="leading-tight">
          <div className={`font-bold text-base ${text}`}>TN Universities</div>
          <div className={`text-xs font-semibold tracking-wider uppercase ${sub}`}>Connect · Ghana</div>
        </div>
      )}
    </Link>
  );
}

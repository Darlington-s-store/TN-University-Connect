import logoAsset from "@/assets/TN LOGO.jpeg";
import { Link } from "react-router-dom";

export default function Logo({
  className = "",
  showText = true,
  variant = "default",
  size = "md",
}: {
  className?: string;
  showText?: boolean;
  variant?: "default" | "light";
  size?: "sm" | "md" | "lg";
}) {
  const text = variant === "light" ? "text-white" : "text-secondary";
  const sub = variant === "light" ? "text-white/70" : "text-ghana-green";

  const sizes = {
    sm: "h-8 w-8",
    md: "h-11 w-11",
    lg: "h-16 w-16",
  };

  const fontSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  const subFontSizes = {
    sm: "text-[8px]",
    md: "text-[10px]",
    lg: "text-xs",
  };

  return (
    <Link to="/" className={`flex items-center gap-3 group ${className}`}>
      <div
        className={`relative ${sizes[size]} rounded-full bg-white p-0.5 shadow-sm transition-smooth group-hover:scale-105 group-hover:shadow-md`}
      >
        <img
          src={logoAsset}
          alt="TN Universities Connect logo"
          className="h-full w-full rounded-full object-contain"
        />
      </div>
      {showText && (
        <div className="leading-tight">
          <div className={`font-bold tracking-tight ${fontSizes[size]} ${text}`}>
            TN Universities
          </div>
          <div className={`font-bold tracking-[0.15em] uppercase ${subFontSizes[size]} ${sub}`}>
            Connect • Ghana
          </div>
        </div>
      )}
    </Link>
  );
}

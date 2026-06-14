import logoAsset from "@/assets/TN LOGO.jpeg";
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
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex hero-gradient text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-ghana-red/20 blur-3xl" />
        <div className="relative z-10">
          <Logo variant="light" />
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold leading-tight">Guide. Work. Inspire.</h2>
          <p className="mt-4 text-white/80 max-w-md">
            A nationwide community of students, alumni and universities, building Ghana's future
            together.
          </p>
          <div className="mt-8 flex gap-2">
            <span className="h-1.5 w-12 rounded-full bg-ghana-red" />
            <span className="h-1.5 w-12 rounded-full bg-ghana-gold" />
            <span className="h-1.5 w-12 rounded-full bg-ghana-green" />
          </div>
        </div>
        <div className="relative z-10 text-sm text-white/60">
          © {new Date().getFullYear()} TN Universities Connect
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="lg:hidden mb-8">
          <Logo />
        </div>
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-3xl font-bold text-secondary">{title}</h1>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-sm text-muted-foreground text-center">{footer}</div>}
          <div className="mt-10 text-center">
            <Link to="/" className="text-xs text-muted-foreground hover:text-primary">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center bg-muted/30 px-4">
      <div className="text-center max-w-md">
        <div className="h-2 flag-stripe rounded-full mb-8" />
        <h1 className="text-8xl font-bold text-secondary">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-secondary">Page not found</h2>
        <p className="mt-2 text-muted-foreground">The page you're looking for doesn't exist or has moved.</p>
        <Button asChild className="mt-6"><Link to="/"><Home className="h-4 w-4" /> Back to home</Link></Button>
      </div>
    </div>
  );
}

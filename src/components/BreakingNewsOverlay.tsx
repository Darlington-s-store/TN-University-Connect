import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BreakingNewsOverlay() {
  const [visible, setVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (!visible) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setVisible(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [visible]);

  if (!visible) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white rounded-full"
          onClick={() => setVisible(false)}
        >
          <X className="h-5 w-5" />
        </Button>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHeEMW2wZdKSDjbqr9CO6LHukMYkngIJbR8z6Fxil9Hg&s"
          alt="In Memoriam"
          className="w-full object-contain bg-black max-h-[70vh]"
        />
        <div className="p-5 text-center space-y-2">
          <h2 className="text-xl font-extrabold text-secondary">Rest in Peace</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We are deeply saddened by the passing of a UCC student. Our heartfelt condolences go
            out to the family, friends, and the university community.
          </p>
          <div className="text-xs text-muted-foreground pt-1">
            This message will close in{" "}
            <span className="font-bold text-secondary">
              {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

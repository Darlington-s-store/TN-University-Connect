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

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative bg-black rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden border border-slate-800">
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-3 right-3 z-10 bg-black/50 hover:bg-black/85 text-white rounded-full border border-white/10"
          onClick={() => setVisible(false)}
        >
          <X className="h-5 w-5" />
        </Button>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHeEMW2wZdKSDjbqr9CO6LHukMYkngIJbR8z6Fxil9Hg&s"
          alt="Breaking News"
          className="w-full h-auto max-h-[80vh] object-contain bg-black block"
        />
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Volume2, VolumeX, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  getSettings,
  getAnnouncements,
  getBlogs,
  type SiteSettings,
  type Announcement,
  type BlogPost,
} from "@/lib/data";
import { NICHES, GHANA_SCHOOLS } from "@/lib/schools";
import { useAuth } from "@/lib/auth";

type ChatMsg = { role: "user" | "assistant"; content: string };

const FUNCTIONS_URL = `https://tfbodlrexoqenaqpzjhq.functions.supabase.co/chat-bot`;
const STORAGE_VOICE_KEY = "tnu_chat_voice_on";

const GREETING: ChatMsg = {
  role: "assistant",
  content:
    "Hi! I'm the TN Connect Assistant 👋 Ask me anything — how to register, about Ghanaian universities, announcements, scholarships, or any study question.",
};

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[*_`#>[\]()]/g, ""));
    u.rate = 1;
    u.pitch = 1;
    u.lang = "en-US";
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((v) => /en-US|en-GB|en/.test(v.lang) && /female|samantha|google/i.test(v.name)) ??
      voices.find((v) => /en-US|en-GB|en/.test(v.lang));
    if (preferred) u.voice = preferred;
    window.speechSynthesis.speak(u);
  } catch (err) {
    console.warn("speech failed", err);
  }
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [messages, setMessages] = useState<ChatMsg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceOn, setVoiceOn] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem(STORAGE_VOICE_KEY) !== "0";
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function loadData() {
      try {
        const [settingsData, annData, blogData] = await Promise.allSettled([
          getSettings(),
          getAnnouncements(),
          getBlogs(),
        ]);
        if (settingsData.status === "fulfilled") setSiteSettings(settingsData.value);
        if (annData.status === "fulfilled") setAnnouncements(annData.value);
        if (blogData.status === "fulfilled") setBlogs(blogData.value);
      } catch (err) {
        console.warn("Failed to load application data for chatbot:", err);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (siteSettings?.chatbotGreeting) {
      setMessages((prev) => {
        if (prev.length === 1 && prev[0].content === GREETING.content) {
          return [{ role: "assistant", content: siteSettings.chatbotGreeting }];
        }
        return prev;
      });
    }
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_VOICE_KEY, voiceOn ? "1" : "0");
    if (!voiceOn && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }, [voiceOn]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      // Warm up voices list
      if ("speechSynthesis" in window) window.speechSynthesis.getVoices();
    } else if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const history: ChatMsg[] = [...messages, { role: "user", content: text }];
    setMessages(history);
    setInput("");
    setLoading(true);

    // Add placeholder assistant message we will stream into
    let assistant = "";
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    // Construct application context to feed the chatbot
    const userCtxText = user
      ? `Logged-in User Profile:
- Name: ${user.name}
- Email: ${user.email}
- Role: ${user.role}
- University: ${user.university || "Not set"}
- Department: ${user.department || "Not set"}
- Level: ${user.level || "Not set"}
- Profile Complete: ${user.profileComplete ? "Yes" : "No"}`
      : "User status: Guest / Not logged in";

    const annsCtxText =
      announcements.length > 0
        ? `Active Announcements:
${announcements
  .slice(0, 5)
  .map((a) => `- [Announcement] Title: "${a.title}" (Date: ${a.date}) | Excerpt: "${a.excerpt}"`)
  .join("\n")}`
        : "No active announcements found.";

    const blogsCtxText =
      blogs.length > 0
        ? `Recent Blogs:
${blogs
  .slice(0, 5)
  .map((b) => `- [Blog] Title: "${b.title}" by ${b.author} | Excerpt: "${b.excerpt}"`)
  .join("\n")}`
        : "No recent blog posts found.";

    const siteSettingsCtxText = siteSettings
      ? `Site Configuration:
- Site Name: ${siteSettings.siteName}
- Tagline: ${siteSettings.tagline}
- Contact Email: ${siteSettings.contactEmail}
- Contact Phone: ${siteSettings.contactPhone}
- Description: ${siteSettings.description}
- Registration Open: ${siteSettings.allowRegistration ? "Yes" : "No"}`
      : "";

    const appContextPrompt = `
[Application Context]
${userCtxText}

${siteSettingsCtxText}

${annsCtxText}

${blogsCtxText}
`;

    try {
      const res = await fetch(FUNCTIONS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          systemPrompt: siteSettings?.chatbotSystemPrompt,
          model: siteSettings?.chatbotModel,
          appContext: appContextPrompt,
        }),
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: "Chat failed" }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const data = trimmed.slice(5).trim();
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistant += delta;
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: assistant };
                return copy;
              });
            }
          } catch {
            /* ignore parse errors on partial chunks */
          }
        }
      }

      if (voiceOn && assistant) speak(assistant);
    } catch (err) {
      const msg = (err as Error).message || "Sorry, I couldn't respond right now.";
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content: `⚠️ ${msg}`,
        };
        return copy;
      });
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const reset = () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setMessages([
      {
        role: "assistant",
        content: siteSettings?.chatbotGreeting || GREETING.content,
      },
    ]);
  };

  if (siteSettings && !siteSettings.chatbotEnabled) {
    return null;
  }

  return (
    <>
      {/* Floating launcher */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "fixed bottom-5 right-5 z-[60] h-14 w-14 rounded-full shadow-2xl flex items-center justify-center text-white",
          "bg-gradient-to-br from-primary via-primary to-ghana-green",
        )}
        aria-label="Open chat assistant"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && (
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-ghana-gold animate-pulse border-2 border-white" />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-3 left-3 sm:left-auto sm:right-5 sm:w-[380px] z-[60] h-[560px] max-h-[80vh] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-secondary via-secondary to-slate-900 text-white p-4">
              <div className="h-0.5 flag-stripe absolute top-0 left-0 right-0" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-ghana-green flex items-center justify-center text-lg font-bold shadow-lg">
                    TN
                  </div>
                  <div>
                    <div className="font-semibold text-sm">TN Uniconnect Assistant</div>
                    <div className="text-[11px] text-white/70 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                      Online · AI powered
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setVoiceOn((v) => !v)}
                    className="h-8 w-8 rounded-md hover:bg-white/10 flex items-center justify-center transition"
                    aria-label={voiceOn ? "Mute voice" : "Enable voice"}
                    title={voiceOn ? "Mute voice" : "Enable voice"}
                  >
                    {voiceOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={reset}
                    className="h-8 w-8 rounded-md hover:bg-white/10 flex items-center justify-center transition"
                    aria-label="Reset conversation"
                    title="Reset"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-card border border-border text-foreground rounded-bl-sm",
                    )}
                  >
                    {m.content ||
                      (loading && idx === messages.length - 1 ? (
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
                        </span>
                      ) : null)}
                  </div>
                </div>
              ))}
            </div>

            {/* Composer */}
            <div className="p-3 border-t border-border bg-background">
              <div className="flex items-center gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder="Ask anything…"
                  disabled={loading}
                  className="flex-1 h-10"
                />
                <Button
                  onClick={send}
                  disabled={loading || !input.trim()}
                  size="icon"
                  className="h-10 w-10 shrink-0 bg-primary hover:bg-primary/90"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
                Powered by Lovable AI · {voiceOn ? "Voice on" : "Voice muted"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

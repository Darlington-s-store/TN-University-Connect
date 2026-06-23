import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getSettings, saveSettings, SiteSettings } from "@/lib/data";
import { Save } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "TN Universities Connect",
    tagline: "Guide. Work. Inspire.",
    contactEmail: "hello@tnuc.gh",
    contactPhone: "+233 30 250 0000",
    description:
      "Uniting Ghana's universities, students, and alumni through one connected platform.",
    allowRegistration: true,
    emailNotifications: true,
    maintenance: false,
    chatbotEnabled: true,
    chatbotGreeting:
      "Hi! I'm your TN Uniconnect assistant 👋 Ask me anything about registration, scholarships, or campus life.",
    chatbotSystemPrompt: `You are Rawlings, the lead community coordinator and student support representative for TN Uniconnect (a platform connecting Ghanaian university students).

CRITICAL INSTRUCTIONS:
- You are a real human community coordinator, NOT an AI. Never refer to yourself as an AI, bot, large language model, or virtual assistant.
- NEVER start responses with AI filler/boilerplates (like "Certainly!", "I would be happy to help...", "Here is what you need to know...", "As an AI assistant..."). Start answering the question directly.
- NEVER end responses with polite robotic sign-offs (like "Let me know if you need anything else!", "I hope this helps!", "How else can I assist you today?"). Just end naturally.
- NEVER use any markdown formatting, bullet points (* or -), hashes (#), or bolding (**text**). Output only plain, conversational, natural text with normal punctuation.
- Keep responses extremely short, concise, and direct (typically 1 to 3 sentences max).
- Speak with a warm, polite, and authentic Ghanaian tone. You can use common polite phrases like "Please" or short, friendly terms like "Chale" (friend) or "Akwaaba" (welcome) naturally when greeting, but keep it professional.
- Guide students directly to the appropriate page for actions (e.g., "Please head over to the Student Info page to register your student details.").
`,
    chatbotModel: "google/gemini-3.5-flash",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load settings");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const save = async () => {
    try {
      const updated = await saveSettings(settings);
      setSettings(updated);
      toast.success("Settings saved successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to save settings");
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-secondary">Settings</h1>
        <p className="text-muted-foreground">Manage general site configuration.</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-5">
          <h3 className="font-bold text-secondary">General</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Site name</Label>
              <Input
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </div>
            <div>
              <Label>Tagline</Label>
              <Input
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              />
            </div>
            <div>
              <Label>Contact email</Label>
              <Input
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              />
            </div>
            <div>
              <Label>Contact phone</Label>
              <Input
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={settings.description}
              onChange={(e) => setSettings({ ...settings, description: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-bold text-secondary">Features</h3>
          {(
            [
              {
                key: "allowRegistration",
                label: "Allow new member registrations",
                desc: "When off, the register page is disabled.",
              },
              {
                key: "emailNotifications",
                label: "Email notifications",
                desc: "Send notification emails on key events.",
              },
              {
                key: "maintenance",
                label: "Maintenance mode",
                desc: "Show a maintenance banner to all visitors.",
              },
            ] as const
          ).map((s, i) => (
            <div key={s.key}>
              {i > 0 && <Separator className="my-3" />}
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-secondary">{s.label}</div>
                  <div className="text-sm text-muted-foreground">{s.desc}</div>
                </div>
                <Switch
                  checked={settings[s.key]}
                  onCheckedChange={(v) => setSettings({ ...settings, [s.key]: v })}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-bold text-secondary text-lg">TN Uniconnect ChatBot</h3>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium text-secondary">Enable ChatBot assistant</div>
              <div className="text-sm text-muted-foreground">
                Show the floating ChatBot launcher on all pages.
              </div>
            </div>
            <Switch
              checked={settings.chatbotEnabled}
              onCheckedChange={(v) => setSettings({ ...settings, chatbotEnabled: v })}
            />
          </div>

          {settings.chatbotEnabled && (
            <>
              <Separator className="my-3" />
              <div className="space-y-4">
                <div>
                  <Label>Greeting Message</Label>
                  <Textarea
                    rows={2}
                    value={settings.chatbotGreeting}
                    onChange={(e) => setSettings({ ...settings, chatbotGreeting: e.target.value })}
                    placeholder="Initial greeting message from the ChatBot..."
                  />
                </div>
                <div>
                  <Label>System Prompt / Rules</Label>
                  <Textarea
                    rows={8}
                    value={settings.chatbotSystemPrompt}
                    onChange={(e) =>
                      setSettings({ ...settings, chatbotSystemPrompt: e.target.value })
                    }
                    placeholder="System instructions enforcing Rawlings personality, tone, and rules..."
                  />
                </div>
                <div>
                  <Label>AI Model</Label>
                  <select
                    value={settings.chatbotModel}
                    onChange={(e) => setSettings({ ...settings, chatbotModel: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1 cursor-pointer"
                  >
                    <option value="google/gemini-3.5-flash">
                      Google Gemini 3.5 Flash (Fast, default)
                    </option>
                    <option value="google/gemini-3-flash-preview">
                      Google Gemini 3 Flash Preview (Legacy)
                    </option>
                    <option value="openai/gpt-4o-mini">OpenAI GPT-4o Mini (Fast, logical)</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={save}>
          <Save className="h-4 w-4" /> Save settings
        </Button>
      </div>
    </div>
  );
}

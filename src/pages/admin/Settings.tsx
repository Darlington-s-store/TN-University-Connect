import { useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: "TN Universities Connect",
    tagline: "Guide. Work. Inspire.",
    contactEmail: "hello@tnuc.gh",
    contactPhone: "+233 30 250 0000",
    description:
      "Uniting Ghana's universities, students, and alumni through one connected platform.",
    allowRegistration: true,
    emailNotifications: true,
    maintenance: false,
  });

  const save = () => toast.success("Settings saved");

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
          {[
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
          ].map((s, i) => (
            <div key={s.key}>
              {i > 0 && <Separator className="my-3" />}
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-secondary">{s.label}</div>
                  <div className="text-sm text-muted-foreground">{s.desc}</div>
                </div>
                <Switch
                  checked={(settings as any)[s.key]}
                  onCheckedChange={(v) => setSettings({ ...settings, [s.key]: v } as any)}
                />
              </div>
            </div>
          ))}
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

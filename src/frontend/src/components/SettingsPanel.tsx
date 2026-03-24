import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  Gamepad2,
  Loader2,
  MessageSquare,
  Monitor,
  Volume2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  type Settings,
  Variant_firstPerson_thirdPerson,
  Variant_low_high_medium,
} from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useDefaultSettings,
  useGetSettings,
  useUpdateSettings,
} from "../hooks/useQueries";

interface SettingsPanelProps {
  onClose: () => void;
}

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const defaultSettings = useDefaultSettings();
  const { data: savedSettings, isLoading } = useGetSettings();
  const { mutate: updateSettings, isPending } = useUpdateSettings();

  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    if (savedSettings) setSettings(savedSettings);
  }, [savedSettings]);

  const handleSave = () => {
    if (!isAuthenticated) {
      toast.error("Please login to save settings");
      return;
    }
    updateSettings(settings, {
      onSuccess: () => toast.success("Settings saved!"),
      onError: () => toast.error("Failed to save settings"),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="panel-dark rounded-lg w-full max-w-lg mx-4 border border-neon-orange/30 animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-gaming text-neon-orange text-lg tracking-wider">
            SETTINGS
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-neon-orange" />
          </div>
        ) : (
          <Tabs defaultValue="gameplay" className="p-4">
            <TabsList className="grid grid-cols-3 mb-4 bg-muted">
              <TabsTrigger value="gameplay" className="font-gaming text-xs">
                GAMEPLAY
              </TabsTrigger>
              <TabsTrigger value="graphics" className="font-gaming text-xs">
                GRAPHICS
              </TabsTrigger>
              <TabsTrigger value="controls" className="font-gaming text-xs">
                CONTROLS
              </TabsTrigger>
            </TabsList>

            <TabsContent value="gameplay" className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded">
                <div className="flex items-center gap-3">
                  <Eye className="w-4 h-4 text-neon-orange" />
                  <div>
                    <Label className="text-sm font-medium">
                      Violence Toggle
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Enable blood and combat effects
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.violenceToggle}
                  onCheckedChange={(v) =>
                    setSettings({ ...settings, violenceToggle: v })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-neon-orange" />
                  <div>
                    <Label className="text-sm font-medium">Chat Enabled</Label>
                    <p className="text-xs text-muted-foreground">
                      Show in-game text chat
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.chatEnabled}
                  onCheckedChange={(v) =>
                    setSettings({ ...settings, chatEnabled: v })
                  }
                />
              </div>

              <div className="p-3 bg-muted/30 rounded space-y-2">
                <div className="flex items-center gap-3">
                  <Eye className="w-4 h-4 text-neon-orange" />
                  <Label className="text-sm font-medium">
                    Default Camera Mode
                  </Label>
                </div>
                <Select
                  value={settings.cameraMode}
                  onValueChange={(v) =>
                    setSettings({
                      ...settings,
                      cameraMode: v as Variant_firstPerson_thirdPerson,
                    })
                  }
                >
                  <SelectTrigger className="bg-muted border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="panel-dark border-border">
                    <SelectItem
                      value={Variant_firstPerson_thirdPerson.firstPerson}
                    >
                      First Person
                    </SelectItem>
                    <SelectItem
                      value={Variant_firstPerson_thirdPerson.thirdPerson}
                    >
                      Third Person
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="graphics" className="space-y-4">
              <div className="p-3 bg-muted/30 rounded space-y-2">
                <div className="flex items-center gap-3">
                  <Monitor className="w-4 h-4 text-neon-orange" />
                  <Label className="text-sm font-medium">
                    Graphics Quality
                  </Label>
                </div>
                <Select
                  value={settings.graphicsQuality}
                  onValueChange={(v) =>
                    setSettings({
                      ...settings,
                      graphicsQuality: v as Variant_low_high_medium,
                    })
                  }
                >
                  <SelectTrigger className="bg-muted border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="panel-dark border-border">
                    <SelectItem value={Variant_low_high_medium.low}>
                      Low
                    </SelectItem>
                    <SelectItem value={Variant_low_high_medium.medium}>
                      Medium
                    </SelectItem>
                    <SelectItem value={Variant_low_high_medium.high}>
                      High
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="controls" className="space-y-3">
              <div className="p-3 bg-muted/30 rounded space-y-2">
                <div className="flex items-center gap-3">
                  <Gamepad2 className="w-4 h-4 text-neon-orange" />
                  <Label className="text-sm font-medium">Control Scheme</Label>
                </div>
                <Select
                  value={settings.controlScheme}
                  onValueChange={(v) =>
                    setSettings({ ...settings, controlScheme: v })
                  }
                >
                  <SelectTrigger className="bg-muted border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="panel-dark border-border">
                    <SelectItem value="default">Default (WASD)</SelectItem>
                    <SelectItem value="arrows">Arrow Keys</SelectItem>
                    <SelectItem value="gamepad">Gamepad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-3 bg-muted/30 rounded text-xs text-muted-foreground space-y-1">
                <p className="font-gaming text-neon-orange text-xs mb-2">
                  KEY BINDINGS
                </p>
                {[
                  ["WASD / Arrows", "Move"],
                  ["Space", "Jump"],
                  ["Shift", "Sprint"],
                  ["V", "Toggle Camera"],
                  ["E", "Interact"],
                  ["F", "Pick Up / Use"],
                  ["I", "Inventory"],
                  ["M", "Map"],
                  ["ESC", "Pause Menu"],
                  ["T", "Chat"],
                ].map(([key, action]) => (
                  <div key={key} className="flex justify-between">
                    <span className="bg-muted px-2 py-0.5 rounded font-mono text-foreground">
                      {key}
                    </span>
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        <div className="flex gap-2 p-4 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-border"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending || !isAuthenticated}
            className="flex-1 btn-neon font-gaming text-xs tracking-wider"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "SAVE SETTINGS"
            )}
          </Button>
        </div>
        {!isAuthenticated && (
          <p className="text-center text-xs text-muted-foreground pb-3">
            Login to save settings
          </p>
        )}
      </div>
    </div>
  );
}

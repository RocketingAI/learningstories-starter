import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet";
import { Switch } from "~/components/ui/switch";

const settings = [
  {
    id: "notifications",
    title: "Notifications",
    description: "Receive notifications about project updates and mentions",
    enabled: true,
  },
  {
    id: "autosave",
    title: "Auto-save",
    description: "Automatically save changes while editing proposals",
    enabled: true,
  },
  {
    id: "ai-suggestions",
    title: "AI Suggestions",
    description: "Get AI-powered content suggestions while writing",
    enabled: true,
  },
];

interface SettingsSheetProps {
  children?: React.ReactNode;
}

export function SettingsSheet({ children }: SettingsSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {children || (
          <Button variant="outline">Settings</Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Configure your application settings
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 py-4">
          <div className="grid gap-4">
            {settings.map((setting) => (
              <Card key={setting.id}>
                <CardHeader>
                  <CardTitle>{setting.title}</CardTitle>
                  <CardDescription>{setting.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Switch id={setting.id} defaultChecked={setting.enabled} />
                    <Label htmlFor={setting.id}>Enabled</Label>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline">Reset to Defaults</Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

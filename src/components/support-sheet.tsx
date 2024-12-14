import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { MessageCircle, Mail, BookOpen, LifeBuoy } from "lucide-react";

interface SupportSheetProps {
  children?: React.ReactNode;
}

export function SupportSheet({ children }: SupportSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {children || (
          <Button variant="outline">Support</Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Support</SheetTitle>
          <SheetDescription>
            Get help with your questions and issues.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Live Chat
              </CardTitle>
              <CardDescription>Chat with our support team in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Start Chat</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Support
              </CardTitle>
              <CardDescription>Send us an email and we'll get back to you</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                support@example.com
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Documentation
              </CardTitle>
              <CardDescription>Browse our comprehensive documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">View Docs</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LifeBuoy className="h-5 w-5" />
                Help Center
              </CardTitle>
              <CardDescription>Find answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Visit Help Center</Button>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}

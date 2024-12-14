import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";

interface FeedbackSheetProps {
  children?: React.ReactNode;
}

export function FeedbackSheet({ children }: FeedbackSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {children || (
          <Button variant="outline">Feedback</Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Send Feedback</SheetTitle>
          <SheetDescription>
            Help us improve our product by sharing your thoughts and experiences.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="feedback">Your feedback</Label>
            <Textarea
              id="feedback"
              placeholder="Tell us what's on your mind..."
              className="min-h-[150px]"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline">Cancel</Button>
            <Button>Submit Feedback</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

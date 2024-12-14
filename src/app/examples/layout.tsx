// import { GeistSans } from "geist/font/sans";
import "~/styles/globals.css";

import Warnings from "~/components/openai-components/warnings";
import { assistantId } from "~/app/assistant-config";

export const metadata = {
  title: "Assistants API Quickstart",
  description: "A quickstart template using the Assistants API with OpenAI",
  icons: {icon: "/openai.svg",},
};

export default function ExamplesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="bg-background text-foreground">
        {!assistantId && <Warnings />}
        {assistantId ? children : <Warnings />}
      </div>
  );
}
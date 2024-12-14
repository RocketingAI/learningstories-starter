import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignIn appearance={{
        elements: {
          formButtonPrimary: "bg-primary hover:bg-primary/90",
          card: "shadow-none"
        }
      }} />
    </div>
  );
}
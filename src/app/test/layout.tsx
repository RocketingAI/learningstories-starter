export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto py-4">
      {children}
    </div>
  );
}

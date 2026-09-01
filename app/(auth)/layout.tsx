export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8">
        <span className="text-xl font-semibold tracking-tight text-foreground">
          FlowAgent
        </span>
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}

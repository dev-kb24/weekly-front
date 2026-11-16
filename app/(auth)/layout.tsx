export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[--color-bg] px-4 py-8">
      <div className="w-full max-w-sm bg-[--color-bg] rounded-2xl border border-[--color-border] p-8">
        <h1 className="text-4xl font-black tracking-tight text-[--color-text] mb-8 text-center">WeeklyFit</h1>
        {children}
      </div>
    </div>
  );
}

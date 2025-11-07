import { PulseGuardLogo } from '@/components/icons/pulse-guard-logo';

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center gap-4 px-4 md:px-8">
        <PulseGuardLogo className="text-primary" />
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          PulseGuard
        </h1>
      </div>
    </header>
  );
}

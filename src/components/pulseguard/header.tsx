import { PulseGuardLogo } from '@/components/icons/pulse-guard-logo';
import { cn } from '@/lib/utils';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center gap-4 px-4 md:px-8">
        <div className="flex items-center gap-2 transition-transform hover:scale-105 duration-300">
          {/* Add a glow to the logo */}
          <div className="relative">
            <div className="absolute inset-0 blur-lg bg-primary/40 rounded-full animate-pulse" />
            <PulseGuardLogo className="relative text-primary h-8 w-8" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            PillPulse
          </h1>
        </div>
      </div>
    </header>
  );
}

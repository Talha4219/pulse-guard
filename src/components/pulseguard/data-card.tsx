'use client';
import { useState, useEffect } from 'react';
import type { LucideProps } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface DataCardProps {
  title: string;
  value: number | null;
  unit: string;
  icon: React.ComponentType<LucideProps>;
  description: string;
}

export function DataCard({ title, value, unit, icon: Icon, description }: DataCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value !== null) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <Card className="shadow-md transition-shadow hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <Icon className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {value !== null ? (
          <div className="flex items-baseline gap-2">
            <span 
              key={value}
              className={cn(
                "text-4xl font-bold tracking-tighter",
                isAnimating && "animate-pulse"
              )}
            >
              {value}
            </span>
            <span className="text-lg font-medium text-muted-foreground">{unit}</span>
          </div>
        ) : (
          <Skeleton className="h-10 w-24" />
        )}
        <p className="text-xs text-muted-foreground pt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

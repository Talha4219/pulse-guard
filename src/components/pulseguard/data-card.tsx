'use client';
import { useState, useEffect } from 'react';
import type { LucideProps } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DataCardProps {
  title: string;
  value: number | null;
  unit: string;
  icon: React.ComponentType<LucideProps>;
  description: string;
  index?: number;
}

export function DataCard({ title, value, unit, icon: Icon, description, index = 0 }: DataCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value !== null) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="glass-card-hover border-white/5 bg-white/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium text-white/80">{title}</CardTitle>
          <div className="p-2 rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
            <Icon className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          {value !== null ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span
                  key={value}
                  className={cn(
                    "text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50",
                    isAnimating && "animate-pulse"
                  )}
                >
                  {value}
                </span>
                <span className="text-lg font-medium text-muted-foreground">{unit}</span>
              </div>
            </div>
          ) : (
            <Skeleton className="h-10 w-24 bg-white/5" />
          )}
          <p className="text-xs text-muted-foreground pt-2 border-t border-white/5 mt-4">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

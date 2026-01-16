'use client';
import { useState, useEffect } from 'react';
import type { LucideProps } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DataCardProps {
  title: string;
  value: string | number | null;
  unit?: string;
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="h-full"
    >
      <Card className="h-full border-sidebar-border bg-card shadow-sm hover:border-primary/50 transition-colors duration-300 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pl-5">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
          <div className="p-1.5 rounded-md bg-sidebar-accent text-primary">
            <Icon className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="pl-5 pt-0">
          {value !== null ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span
                  key={value} // trigger animation key
                  className={cn(
                    "text-3xl font-bold tracking-tight text-foreground",
                    isAnimating && "text-primary"
                  )}
                >
                  {value}
                </span>
                <span className="text-sm font-medium text-muted-foreground">{unit}</span>
              </div>
            </div>
          ) : (
            <Skeleton className="h-9 w-24 bg-sidebar-accent" />
          )}
          <p className="text-xs text-muted-foreground/60 pt-3 mt-1 truncate">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

'use client';

import { Lightbulb, AlertTriangle, Activity, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import type { HealthSuggestionOutput } from '@/app/page';
import { motion } from 'framer-motion';

interface HealthAdvisorProps {
  suggestions: HealthSuggestionOutput | null;
  isLoading: boolean;
}

const statusIcons: Record<string, React.ReactNode> = {
  normal: <ShieldCheck className="h-5 w-5 text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />,
  elevated: <AlertTriangle className="h-5 w-5 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />,
  low: <AlertTriangle className="h-5 w-5 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />,
  critical: <AlertTriangle className="h-5 w-5 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />,
};


export function HealthAdvisor({ suggestions, isLoading }: HealthAdvisorProps) {

  if (isLoading) {
    return (
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-primary animate-pulse" />
            Health Advisor
          </CardTitle>
          <CardDescription>
            Analyzing your vitals to provide health suggestions...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full bg-white/5" />
          <Skeleton className="h-16 w-full bg-white/5" />
        </CardContent>
      </Card>
    );
  }

  if (!suggestions) {
    return (
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-primary/50" />
            Health Advisor
          </CardTitle>
          <CardDescription>
            Health suggestions will appear here once vitals are available.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Waiting for sufficient data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-panel border-primary/20 bg-gradient-to-br from-card/50 to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10 ring-1 ring-primary/30">
              <Lightbulb className="h-5 w-5 text-primary" />
            </div>
            Health Advisor
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/5 px-3 py-1 rounded-full w-fit">
            {statusIcons[suggestions.overallStatus] || <Activity className="h-5 w-5" />}
            <span className="capitalize font-medium text-white/90">Overall Status: {suggestions.overallStatus}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-primary">
              <Activity className="h-5 w-5" />
              Precautions
            </h3>
            <ul className="space-y-2">
              {suggestions.precautions.map((precaution, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  {precaution}
                </li>
              ))}
            </ul>
          </div>

          <Alert variant={suggestions.overallStatus === 'critical' ? 'destructive' : 'default'} className="border-l-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className={suggestions.overallStatus === 'critical' ? 'text-destructive-foreground' : 'text-foreground'}>
              Potential Health Concerns
            </AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1 mt-2 text-muted-foreground">
                {suggestions.possibleDiseases.map((disease, index) => (
                  <li key={index}>{disease}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </motion.div>
  );
}

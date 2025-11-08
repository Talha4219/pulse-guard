'use client';

import { Lightbulb, AlertTriangle, Activity, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import type { HealthSuggestionOutput } from '@/app/page';

interface HealthAdvisorProps {
  suggestions: HealthSuggestionOutput | null;
  isLoading: boolean;
}

const statusIcons: Record<string, React.ReactNode> = {
    normal: <ShieldCheck className="h-5 w-5 text-green-500" />,
    elevated: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    low: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    critical: <AlertTriangle className="h-5 w-5 text-red-500" />,
  };
  

export function HealthAdvisor({ suggestions, isLoading }: HealthAdvisorProps) {

  if (isLoading) {
    return (
        <Card className="shadow-md transition-shadow hover:shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-6 w-6 text-primary" />
                    Health Advisor
                </CardTitle>
                <CardDescription>
                    Analyzing your vitals to provide health suggestions...
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
            </CardContent>
        </Card>
    );
  }

  if (!suggestions) {
    return (
        <Card className="shadow-md transition-shadow hover:shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-6 w-6 text-primary" />
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
    <Card className="shadow-md transition-shadow hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-primary" />
          Health Advisor
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {statusIcons[suggestions.overallStatus] || <Activity className="h-5 w-5" />}
            <span className="capitalize">Overall Status: {suggestions.overallStatus}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2 flex items-center gap-2"><Activity className="h-5 w-5" />Precautions</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {suggestions.precautions.map((precaution, index) => (
              <li key={index}>{precaution}</li>
            ))}
          </ul>
        </div>
        
        <Alert variant={suggestions.overallStatus === 'critical' ? 'destructive' : 'default'}>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Potential Health Concerns</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {suggestions.possibleDiseases.map((disease, index) => (
                <li key={index}>{disease}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

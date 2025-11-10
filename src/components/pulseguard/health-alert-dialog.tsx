'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

interface HealthAlertDialogProps {
  isOpen: boolean;
  diseaseName: string | null;
  onClose: () => void;
  onAcknowledge: () => void;
}

export function HealthAlertDialog({ isOpen, diseaseName, onClose, onAcknowledge }: HealthAlertDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            Health Alert
          </AlertDialogTitle>
          <AlertDialogDescription>
            Patient may have: <span className="font-bold text-destructive">{diseaseName}</span>.
            <br />
            Please report to the patient immediately.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Dismiss</AlertDialogCancel>
          <AlertDialogAction onClick={onAcknowledge} className="bg-blue-600 hover:bg-blue-700">
            On my way
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

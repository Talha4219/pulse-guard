'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { BellRing } from 'lucide-react';

interface AlarmNotificationProps {
  isOpen: boolean;
  onStop: () => void;
  alarmTime: string | null;
}

export function AlarmNotification({ isOpen, onStop, alarmTime }: AlarmNotificationProps) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <BellRing className="h-6 w-6 animate-swing" />
            Appointment Reminder
          </AlertDialogTitle>
          <AlertDialogDescription>
            You have an appointment with FARZAN at {alarmTime}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onStop}>Dismiss</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Add animation keyframes to globals.css for the bell ringing effect if it doesn't exist
// You would add this in your src/app/globals.css file:
/*
@keyframes swing {
  15% { transform: rotate(15deg); }
  30% { transform: rotate(-10deg); }
  45% { transform: rotate(5deg); }
  60% { transform: rotate(-5deg); }
  75% { transform: rotate(2deg); }
  100% { transform: rotate(0deg); }
}

.animate-swing {
  animation: swing 1s ease-in-out;
  transform-origin: top center;
}
*/

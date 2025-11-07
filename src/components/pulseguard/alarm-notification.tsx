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
}

export function AlarmNotification({ isOpen, onStop }: AlarmNotificationProps) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <BellRing className="h-6 w-6 animate-swing" />
            Wake Up!
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your alarm is ringing. Time to start your day!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onStop}>Stop Alarm</AlertDialogAction>
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

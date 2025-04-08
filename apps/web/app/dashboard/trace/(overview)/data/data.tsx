import { CheckCircle, CircleOff, Timer } from 'lucide-react';

export const statuses = [
  {
    value: 'running',
    label: 'Running',
    icon: Timer,
  },
  {
    value: 'done',
    label: 'Done',
    icon: CheckCircle,
  },
  {
    value: 'canceled',
    label: 'Canceled',
    icon: CircleOff,
  },
];

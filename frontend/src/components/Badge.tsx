import clsx from 'clsx';
import { CRITICALITY_COLORS, STATUS_OPTIONS } from '../constants';

interface Props {
  type: 'criticality' | 'status' | 'severity';
  value: string;
  breached?: boolean;
}

const SEVERITY_COLORS: Record<string, string> = {
  S1: 'bg-red-100 text-red-800 border border-red-300',
  S2: 'bg-orange-100 text-orange-800 border border-orange-300',
  S3: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  S4: 'bg-gray-100 text-gray-700 border border-gray-300',
};

export default function Badge({ type, value, breached }: Props) {
  let cls = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold';

  if (type === 'criticality') {
    cls = clsx(cls, CRITICALITY_COLORS[value] || 'bg-gray-100 text-gray-700');
    if (breached && value !== 'Low') cls = clsx(cls, 'animate-pulse');
  } else if (type === 'status') {
    const opt = STATUS_OPTIONS.find(s => s.value === value);
    cls = clsx(cls, opt?.color || 'bg-gray-100 text-gray-700');
  } else {
    cls = clsx(cls, SEVERITY_COLORS[value] || 'bg-gray-100 text-gray-700');
  }

  return <span className={cls}>{value}</span>;
}

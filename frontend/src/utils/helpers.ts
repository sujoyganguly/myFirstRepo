import { format, formatDistanceToNow, parseISO, isPast } from 'date-fns';

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  try { return format(parseISO(iso), 'dd MMM yyyy, hh:mm a'); }
  catch { return iso; }
}

export function formatShortDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  try { return format(parseISO(iso), 'dd MMM yyyy'); }
  catch { return iso; }
}

export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return '—';
  try { return formatDistanceToNow(parseISO(iso), { addSuffix: true }); }
  catch { return iso; }
}

export function isOverdue(iso: string | null | undefined): boolean {
  if (!iso) return false;
  try { return isPast(parseISO(iso)); }
  catch { return false; }
}

export function slaTimeRemaining(due: string | null | undefined): string {
  if (!due) return '—';
  try {
    const dueDate = parseISO(due);
    if (isPast(dueDate)) return 'BREACHED';
    return `Due ${formatDistanceToNow(dueDate, { addSuffix: true })}`;
  } catch { return '—'; }
}

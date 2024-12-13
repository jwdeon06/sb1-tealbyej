import { format, parseISO } from 'date-fns';

export function formatDate(date: string | Date, formatString = 'MMM d, yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString);
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM d, yyyy h:mm a');
}
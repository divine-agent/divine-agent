import { formatDuration, intervalToDuration } from 'date-fns';

/**
 * formt date
 * @description iso string to local string
 */
export function formatDate(isoString: string) {
  if (!isoString) {
    return '';
  }

  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

/**
 * format duration in milliseconds to human readable format
 * @param durationMs
 * @returns
 */
export function formatDurationMs(durationMs: number) {
  const totalSeconds = Math.floor(durationMs / 1000);
  const ms = Math.floor(durationMs - totalSeconds * 1000);
  const duration = intervalToDuration({ start: 0, end: durationMs });
  const formatted = formatDuration(duration);
  return ms ? `${formatted} ${ms} ms` : formatted;
}

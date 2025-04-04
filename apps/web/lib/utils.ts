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

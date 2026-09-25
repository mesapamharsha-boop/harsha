/**
 * Common formatting and UI utility functions
 */

export function formatCurrency(amount: number | string): string {
  if (typeof amount === 'string') {
    if (amount.startsWith('₹') || amount.toLowerCase().includes('inr')) return amount;
    const num = parseFloat(amount.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return amount;
    amount = num;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString?: string): string {
  if (!dateString) return 'TBD';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function truncate(str: string, maxLen = 100): string {
  if (!str || str.length <= maxLen) return str;
  return str.slice(0, maxLen) + '...';
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

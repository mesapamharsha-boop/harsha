export const EXACT_9_SERVICES = [
  'Cinematic Reels & Short-Form Content',
  'Event & Celebration Videography',
  'Wedding Reels & Cinematic Coverage',
  'Brand & Product Content',
  'Personal & Lifestyle Shoots',
  'Political Event Reels',
  'Car & Bike Delivery Reels',
  'Photography',
  'Other / Custom Requirement',
] as const;

export type BookingServiceName = (typeof EXACT_9_SERVICES)[number];

export interface PackageOption {
  name: string;
  price: string;
  label: string;
}

export const EXACT_PACKAGES: readonly PackageOption[] = [
  { name: 'Custom / Undecided', price: 'Custom Quote', label: 'Custom / Undecided' },
  { name: 'LEOX Elite — ₹1,599', price: '₹1,599', label: 'LEOX Elite — ₹1,599' },
  { name: 'LEOX Pro — ₹2,999', price: '₹2,999', label: 'LEOX Pro — ₹2,999' },
  { name: 'LEOX Pro+ — ₹4,499', price: '₹4,499', label: 'LEOX Pro+ — ₹4,499' },
  { name: 'LEOX Max — ₹5,999', price: '₹5,999', label: 'LEOX Max — ₹5,999' },
] as const;

/**
 * Normalizes any package query string (e.g. "LEOX Elite", "elite", "LEOX Pro")
 * to the exact label and price in the dropdown.
 */
export function matchPackageSelection(raw?: string | null): { name: string; price: string } {
  if (!raw) return { name: '', price: '' };
  const lower = raw.toLowerCase().trim();

  if (lower.includes('elite')) {
    return { name: 'LEOX Elite — ₹1,599', price: '₹1,599' };
  }
  if (lower.includes('pro+')) {
    return { name: 'LEOX Pro+ — ₹4,499', price: '₹4,499' };
  }
  if (lower.includes('max')) {
    return { name: 'LEOX Max — ₹5,999', price: '₹5,999' };
  }
  if (lower.includes('pro')) {
    return { name: 'LEOX Pro — ₹2,999', price: '₹2,999' };
  }
  if (lower.includes('custom') || lower.includes('undecided')) {
    return { name: 'Custom / Undecided', price: 'Custom Quote' };
  }
  return { name: raw, price: '' };
}

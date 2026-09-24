/**
 * Centralized WhatsApp Configuration & Utilities
 * 
 * All WhatsApp buttons, links, and quick-contact interactions
 * across the application reference this single source of truth.
 */

// Safe environment variable lookup
const safeEnv = (typeof import.meta !== 'undefined' && (import.meta as any)?.env)
  ? (import.meta as any).env
  : (typeof process !== 'undefined' ? process.env : {}) || {};

/**
 * Configurable Provider WhatsApp recipient constant.
 * Stored in a single configuration location and easily overridden via environment variable.
 */
export const PROVIDER_WHATSAPP_NUMBER =
  (safeEnv.VITE_PROVIDER_WHATSAPP_NUMBER as string | undefined)?.trim() ||
  (safeEnv.VITE_WHATSAPP_NUMBER as string | undefined)?.trim() ||
  '';

// Default configuration values
export const WHATSAPP_CONFIG = {
  /**
   * Configured business WhatsApp number
   */
  rawNumber: (safeEnv.VITE_WHATSAPP_NUMBER as string | undefined)?.trim() || '',

  /**
   * International country dialing code without '+' (India = 91)
   */
  countryCode: (safeEnv.VITE_WHATSAPP_COUNTRY_CODE as string | undefined)?.trim() || '91',

  /**
   * Pre-filled greeting message for client inquiries
   */
  defaultMessage:
    (safeEnv.VITE_WHATSAPP_DEFAULT_MESSAGE as string | undefined)?.trim() ||
    'Hi LEOX, I would like to know more about your cinematic reels and visual content services.',

  /**
   * Business display title
   */
  businessName: 'LEOX',
  directorName: 'LEOX',
} as const;

/**
 * Validates whether the configured Provider WhatsApp number is a valid 10-digit Indian mobile number.
 * Does NOT silently modify or invent missing digits.
 */
export function validateProviderWhatsAppNumber(input = PROVIDER_WHATSAPP_NUMBER): {
  isValid: boolean;
  cleanDigits: string;
  normalized: string;
  digitCount: number;
  errorMessage?: string;
} {
  const raw = (input || '').toString().trim();
  const digits = raw.replace(/\D/g, '');

  let nationalDigits = digits;
  if (digits.startsWith('91') && digits.length > 2) {
    nationalDigits = digits.substring(2);
  }

  // A valid Indian mobile number must have exactly 10 digits
  if (nationalDigits.length !== 10) {
    return {
      isValid: false,
      cleanDigits: digits,
      normalized: digits,
      digitCount: nationalDigits.length,
      errorMessage: `Provider WhatsApp number is incomplete or invalid. It must contain exactly 10 digits.`,
    };
  }

  return {
    isValid: true,
    cleanDigits: digits,
    normalized: `91${nationalDigits}`,
    digitCount: 10,
  };
}


/**
 * Normalizes any phone number input into clean digits with country code
 * suitable for standard wa.me URLs (e.g. "919849012345").
 */
export function normalizeWhatsAppNumber(
  inputNumber?: string,
  defaultCountryCode = WHATSAPP_CONFIG.countryCode
): string {
  const raw = (inputNumber || WHATSAPP_CONFIG.rawNumber).toString();
  // Strip all non-digit characters
  let digits = raw.replace(/\D/g, '');

  const cc = defaultCountryCode.replace(/\D/g, '');

  // Remove leading single zero if present (e.g. 09849012345 -> 9849012345)
  if (digits.startsWith('0') && digits.length > 10) {
    digits = digits.substring(1);
  }

  // If already prefixed with country code (e.g., 919849012345)
  if (digits.startsWith(cc) && digits.length === cc.length + 10) {
    return digits;
  }

  // If 10-digit number without country code (e.g., 9849012345)
  if (digits.length === 10) {
    return `${cc}${digits}`;
  }

  // Fallback: if already longer than 10 digits or unusual, return digits as-is
  return digits || `${cc}${WHATSAPP_CONFIG.rawNumber}`;
}

/**
 * Formats a phone number for clean, professional UI display.
 * Avoids duplicate country codes (e.g. never produces "+91 +91...").
 * Formats 9849012345 -> "+91 98490 12345".
 */
export function formatWhatsAppDisplayNumber(
  inputNumber?: string,
  countryCode = WHATSAPP_CONFIG.countryCode
): string {
  const raw = (inputNumber || WHATSAPP_CONFIG.rawNumber).toString();
  let digits = raw.replace(/\D/g, '');
  const cc = countryCode.replace(/\D/g, '');

  // If digits start with the country code and has the remaining 10 digits
  if (digits.startsWith(cc) && digits.length === cc.length + 10) {
    digits = digits.substring(cc.length);
  } else if (digits.startsWith('0') && digits.length === 11) {
    digits = digits.substring(1);
  }

  // If standard 10-digit number, format as +91 98490 12345
  if (digits.length === 10) {
    return `+${cc} ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }

  // Fallback for custom formatted numbers
  return `+${cc} ${digits}`;
}

/**
 * Generates the standard wa.me WhatsApp URL with encoded message text.
 * Format: https://wa.me/<international_number>?text=<encoded_text>
 * 
 * Works across both mobile (opens WhatsApp app) and desktop (opens WhatsApp Web / Desktop).
 */
export function getWhatsAppUrl(options?: {
  message?: string;
  number?: string;
}): string {
  const number = normalizeWhatsAppNumber(options?.number);
  const message = options?.message !== undefined ? options.message : WHATSAPP_CONFIG.defaultMessage;
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${number}?text=${encodedMessage}`;
}

/**
 * Triggers WhatsApp chat directly via window.open with safe target attributes.
 */
export function openWhatsAppChat(options?: {
  message?: string;
  number?: string;
}): void {
  const url = getWhatsAppUrl(options);
  if (typeof window !== 'undefined') {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

/**
 * Validates and normalizes customer-entered Phone/WhatsApp number.
 * Normalizes:
 * - Removes spaces, hyphens, brackets, dots
 * - Removes leading '+' while preserving country code digits
 * - Handles numbers entered with country code
 * - Pre-fixes 91 for 10-digit Indian numbers
 * - Validates length between 10 and 15 digits
 */
export function validateAndNormalizeCustomerWhatsApp(phoneInput: string): {
  isValid: boolean;
  normalized: string;
  errorMessage?: string;
} {
  if (!phoneInput || !phoneInput.trim()) {
    return {
      isValid: false,
      normalized: '',
      errorMessage: 'Please enter a valid WhatsApp number.',
    };
  }

  // Remove spaces, hyphens, brackets, dots, and common separators
  let cleaned = phoneInput.trim().replace(/[\s\-\(\)\.]+/g, '');

  // Remove leading plus sign if present
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }

  // Verify only digits remain
  if (!/^\d+$/.test(cleaned)) {
    return {
      isValid: false,
      normalized: '',
      errorMessage: 'Please enter a valid WhatsApp number.',
    };
  }

  // Strip leading 0 if 11 digits (e.g., 09849012345 -> 9849012345 -> 919849012345)
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.substring(1);
  }

  // If 10-digit mobile number, prepend Indian country code 91
  if (cleaned.length === 10 && /^[6-9]/.test(cleaned)) {
    cleaned = '91' + cleaned;
  }

  // Must be between 10 and 15 digits according to E.164 standard
  if (cleaned.length < 10 || cleaned.length > 15) {
    return {
      isValid: false,
      normalized: '',
      errorMessage: 'Please enter a valid WhatsApp number.',
    };
  }

  return {
    isValid: true,
    normalized: cleaned,
  };
}

export interface BookingWhatsAppMessageData {
  fullName: string;
  phone: string;
  email: string;
  instagramHandle?: string;
  service: string;
  package?: string;
  eventDate: string;
  city: string;
  venue: string;
}

/**
 * Formats an event date into a professional readable format like "11 October 2026"
 */
export function formatEventDate(dateStr?: string): string {
  if (!dateStr || !dateStr.trim()) return 'Not provided';
  const trimmed = dateStr.trim();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // Match YYYY-MM-DD
  const ymdMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const monthIndex = parseInt(ymdMatch[2], 10) - 1;
    const day = parseInt(ymdMatch[3], 10);
    if (monthIndex >= 0 && monthIndex < 12 && day >= 1 && day <= 31) {
      return `${day} ${monthNames[monthIndex]} ${year}`;
    }
  }

  // Match DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const monthIndex = parseInt(dmyMatch[2], 10) - 1;
    const year = parseInt(dmyMatch[3], 10);
    if (monthIndex >= 0 && monthIndex < 12 && day >= 1 && day <= 31) {
      return `${day} ${monthNames[monthIndex]} ${year}`;
    }
  }

  // Fallback to JS Date parsing
  const d = new Date(trimmed);
  if (!isNaN(d.getTime())) {
    const day = d.getDate();
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  }

  return trimmed;
}

/**
 * Builds the official LEOX booking WhatsApp message template.
 */
export function buildBookingWhatsAppMessage(data: BookingWhatsAppMessageData): string {
  const fullName = data.fullName?.trim() || 'Not provided';
  const phone = data.phone?.trim() || 'Not provided';
  const email = data.email?.trim() || 'Not provided';
  const instagram = data.instagramHandle?.trim() || 'Not provided';
  const service = data.service?.trim() || 'Not provided';
  const pkg = data.package?.trim() || 'Not provided';
  const formattedDate = formatEventDate(data.eventDate);
  const city = data.city?.trim() || 'Not provided';
  const venue = data.venue?.trim() || 'Not provided';

  return `LEOX — NEW BOOKING REQUEST

A new booking has been received through the website.

CLIENT DETAILS
Name: ${fullName}
Phone / WhatsApp: ${phone}
Email: ${email}
Instagram: ${instagram}

BOOKING DETAILS
Service: ${service}
Package: ${pkg}
Event Date: ${formattedDate}
City: ${city}
Venue: ${venue}

STATUS
New Booking — Pending Confirmation

Please review the booking details and contact the client to confirm the shoot.`;
}


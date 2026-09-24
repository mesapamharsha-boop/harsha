import { ENV } from '../config/env';
import { formatDisplayDate, formatDisplayTime } from '../utils/dateHelper';

export interface BookingNotificationData {
  bookingId?: string;
  fullName: string;
  phone: string;
  email: string;
  service: string;
  package?: string;
  packagePrice?: string;
  eventDate: string;
  eventTime?: string;
  bookingTime?: string;
  city: string;
  venue: string;
  instagramHandle?: string;
  eventDetails?: string;
}

export interface WhatsAppSendResult {
  success: boolean;
  status: 'sent' | 'failed' | 'pending';
  messageId?: string;
  error?: string;
}

// Re-export for compatibility with other files
export const formatEventDate = formatDisplayDate;

export class WhatsAppService {
  /**
   * Format the booking notification message according to the official LEOX Master Prompt
   */
  buildBookingNotificationMessage(data: BookingNotificationData): string {
    const bookingId = (data.bookingId || '').trim();
    const fullName = (data.fullName || '').trim() || 'Not provided';
    const phone = (data.phone || '').trim() || 'Not provided';
    const email = (data.email || '').trim() || 'Not provided';
    const service = (data.service || '').trim() || 'Not provided';
    const pkg = (data.package || '').trim() || 'Custom / Undecided';

    let rawPrice = (data.packagePrice || '').trim();
    let priceDisplay = 'Custom / On Request';
    if (rawPrice) {
      priceDisplay = rawPrice.startsWith('₹') ? rawPrice : `₹${rawPrice}`;
    }

    const formattedDate = formatDisplayDate(data.eventDate) || data.eventDate || 'Not provided';
    const rawTime = (data.eventTime || data.bookingTime || '').trim();
    const formattedTime = formatDisplayTime(rawTime);

    const city = (data.city || '').trim() || 'Not provided';
    const venue = (data.venue || '').trim() || 'Not provided';
    const notes = (data.eventDetails || '').trim() || 'None';

    const timeBlock = formattedTime ? `\nEvent Time: ${formattedTime}` : '';

    return `NEW LEOX BOOKING

Package: ${pkg}
Price: ${priceDisplay}

Service: ${service}

Customer Name: ${fullName}
Phone: ${phone}
Email: ${email}

Event Date: ${formattedDate}${timeBlock}

Location: ${city}
Venue: ${venue}

Additional Details:
${notes}

Booking ID: ${bookingId ? `#${bookingId}` : 'NEW'}
Status: NEW`;
  }

  /**
   * Automatically send booking notification to configured WhatsApp Business number
   * via official WhatsApp Business / Cloud API (Meta Graph API)
   */
  async sendBookingNotification(data: BookingNotificationData): Promise<WhatsAppSendResult> {
    const rawTarget = ENV.WHATSAPP_BUSINESS_NUMBER || '918374404536';
    const cleanTarget = rawTarget.replace(/[^0-9]/g, '');
    const messageText = this.buildBookingNotificationMessage(data);

    const token = ENV.WHATSAPP_API_TOKEN?.trim();
    const phoneNumberId = ENV.WHATSAPP_PHONE_NUMBER_ID?.trim();

    // If Cloud API credentials are not yet configured in environment variables
    if (!token || !phoneNumberId) {
      console.log(
        `[WhatsAppService] WhatsApp Cloud API credentials not configured. Notification recorded as pending for +${cleanTarget}.`
      );
      return {
        success: false,
        status: 'pending',
        error:
          'WhatsApp Cloud API credentials (WHATSAPP_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID) not configured.',
      };
    }

    try {
      const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;
      const payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: cleanTarget,
        type: 'text',
        text: {
          preview_url: false,
          body: messageText,
        },
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const resData: any = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMsg =
          resData?.error?.message || `HTTP ${response.status} ${response.statusText}`;
        console.error('[WhatsAppService] WhatsApp Cloud API delivery error:', errorMsg);
        return {
          success: false,
          status: 'failed',
          error: errorMsg,
        };
      }

      const messageId = resData?.messages?.[0]?.id || `WA-${Date.now()}`;
      console.log(
        `[WhatsAppService] WhatsApp Cloud API notification sent successfully for booking #${data.bookingId} (ID: ${messageId})`
      );
      return {
        success: true,
        status: 'sent',
        messageId,
      };
    } catch (err: any) {
      console.error(
        '[WhatsAppService] Error dispatching WhatsApp notification:',
        err?.message || err
      );
      return {
        success: false,
        status: 'failed',
        error: err?.message || 'Network error communicating with WhatsApp Cloud API',
      };
    }
  }
}

export const whatsappService = new WhatsAppService();

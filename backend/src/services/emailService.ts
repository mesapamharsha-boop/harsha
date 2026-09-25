import nodemailer, { type Transporter } from 'nodemailer';
import { formatDisplayDate, formatDisplayTime } from '../utils/dateHelper';

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: Transporter | null = null;

  private readonly adminEmail =
    process.env.EMAIL_ADMIN || 'leoxshoots@gmail.com';

  private readonly emailUser =
    process.env.EMAIL_USER || process.env.SMTP_USER || '';

  private readonly emailPassword =
    process.env.EMAIL_PASSWORD || process.env.SMTP_PASSWORD || '';

  constructor() {
    this.init();
  }

  private init() {
    if (!this.emailUser || !this.emailPassword) {
      console.error(
        '[EmailService] ❌ EMAIL_USER or EMAIL_PASSWORD is missing.'
      );
      return;
    }

    try {
      /*
       * Gmail SMTP
       *
       * EMAIL_USER = your Gmail address
       * EMAIL_PASSWORD = Gmail App Password
       */
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: this.emailUser,
          pass: this.emailPassword,
        },
      });

      console.log(
        `[EmailService] ✅ Gmail SMTP configured for ${this.emailUser}`
      );
    } catch (error) {
      console.error(
        '[EmailService] ❌ Failed to initialize transporter:',
        error
      );

      this.transporter = null;
    }
  }

  /**
   * Verify SMTP connection.
   * Call this before sending if you want an immediate connection check.
   */
  public async verifyConnection(): Promise<boolean> {
    if (!this.transporter) {
      console.error(
        '[EmailService] ❌ Email transporter is not configured.'
      );
      return false;
    }

    try {
      await this.transporter.verify();

      console.log(
        '[EmailService] ✅ Gmail SMTP connection verified successfully.'
      );

      return true;
    } catch (error) {
      console.error(
        '[EmailService] ❌ Gmail SMTP verification failed:',
        error
      );

      return false;
    }
  }

  /**
   * Send email
   */
  public async sendMail(
    payload: EmailPayload
  ): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
  }> {
    console.log('\n================================================');
    console.log('[LEOX EMAIL]');
    console.log(`TO: ${payload.to}`);
    console.log(`SUBJECT: ${payload.subject}`);
    console.log('================================================');

    if (!this.transporter) {
      const error =
        'Email transporter is not configured. Check EMAIL_USER and EMAIL_PASSWORD.';

      console.error(`[EmailService] ❌ ${error}`);

      return {
        success: false,
        error,
      };
    }

    try {
      const fromAddress =
        process.env.EMAIL_FROM ||
        this.emailUser ||
        this.adminEmail;

      const info = await this.transporter.sendMail({
        from: `"LEOX Productions" <${fromAddress}>`,
        to: payload.to,
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
      });

      console.log(
        `[EmailService] ✅ Email sent successfully to ${payload.to}`
      );

      console.log(
        `[EmailService] Message ID: ${info.messageId}`
      );

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error: any) {
      console.error(
        `[EmailService] ❌ Failed to send email to ${payload.to}`
      );

      console.error('[EmailService] Error:', error);

      return {
        success: false,
        error: error?.message || 'Unknown email sending error',
      };
    }
  }

  /**
   * ============================================================
   * ADMIN — NEW BOOKING NOTIFICATION
   * ============================================================
   */
  public async sendNewInquiryAdminNotification(data: {
    bookingId?: string;
    name: string;
    email: string;
    phone: string;
    instagram?: string;
    service: string;
    package?: string;
    packagePrice?: string;
    eventDate?: string;
    eventTime?: string;
    city?: string;
    venue?: string;
    eventDetails?: string;
    budget?: string;
  }) {
    const pkg =
      data.package?.trim() || 'Custom / Undecided';

    const rawPrice =
      (data.packagePrice || '').trim();

    const priceDisplay = rawPrice
      ? rawPrice.startsWith('₹')
        ? rawPrice
        : `₹${rawPrice}`
      : 'Custom / On Request';

    const formattedDate =
      formatDisplayDate(data.eventDate) ||
      data.eventDate ||
      'Not provided';

    const formattedTime =
      formatDisplayTime(data.eventTime);

    const pkgDisplay = data.package
      ? `${data.package}${
          data.packagePrice
            ? ` (${priceDisplay})`
            : ''
        }`
      : 'Custom / Undecided';

    const textBody = `
NEW LEOX BOOKING

Booking ID: ${data.bookingId || 'NEW'}

Package: ${pkg}
Price: ${priceDisplay}

Service: ${data.service}

Customer Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email}
Instagram: ${data.instagram || 'Not provided'}

Event Date: ${formattedDate}
${formattedTime ? `Event Time: ${formattedTime}` : ''}

Location: ${data.city || 'N/A'}
Venue: ${data.venue || 'N/A'}

Additional Details:
${data.eventDetails || 'None provided'}

Budget:
${data.budget || 'Not provided'}

Status: NEW
    `.trim();

    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />

<style>
body {
  margin: 0;
  padding: 0;
  background: #08080a;
  font-family: Arial, Helvetica, sans-serif;
  color: #ffffff;
}

.container {
  max-width: 600px;
  margin: 30px auto;
  background: #111217;
  border: 1px solid #252733;
  border-radius: 14px;
  overflow: hidden;
}

.header {
  background: #08080a;
  padding: 30px;
  text-align: center;
  border-bottom: 2px solid #E50914;
}

.logo {
  font-size: 30px;
  font-weight: 900;
  letter-spacing: 5px;
  color: #ffffff;
}

.logo span {
  color: #E50914;
}

.subtitle {
  margin-top: 8px;
  color: #9ca3af;
  font-size: 12px;
  letter-spacing: 2px;
}

.content {
  padding: 30px;
}

.badge {
  display: inline-block;
  background: rgba(229, 9, 20, 0.15);
  color: #ff4d55;
  padding: 7px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 20px;
}

.row {
  padding: 13px 0;
  border-bottom: 1px solid #22242c;
}

.label {
  display: block;
  color: #9ca3af;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 5px;
}

.value {
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
}

.highlight {
  color: #ff4d55;
}

.success {
  color: #22c55e;
}

.details {
  margin-top: 22px;
  padding: 18px;
  background: #181a22;
  border-left: 3px solid #E50914;
  border-radius: 8px;
  color: #d1d5db;
  line-height: 1.6;
}

.footer {
  padding: 20px;
  text-align: center;
  border-top: 1px solid #22242c;
  color: #6b7280;
  font-size: 12px;
}
</style>
</head>

<body>

<div class="container">

  <div class="header">
    <div class="logo">
      LEO<span>X</span>
    </div>

    <div class="subtitle">
      NEW BOOKING REQUEST
    </div>
  </div>

  <div class="content">

    <div class="badge">
      🔥 NEW BOOKING
    </div>

    ${
      data.bookingId
        ? `
    <div class="row">
      <span class="label">Booking ID</span>
      <span class="value highlight">
        #${data.bookingId}
      </span>
    </div>
    `
        : ''
    }

    <div class="row">
      <span class="label">Customer Name</span>
      <span class="value">${data.name}</span>
    </div>

    <div class="row">
      <span class="label">Phone / WhatsApp</span>
      <span class="value">${data.phone}</span>
    </div>

    <div class="row">
      <span class="label">Email</span>
      <span class="value">${data.email}</span>
    </div>

    <div class="row">
      <span class="label">Instagram</span>
      <span class="value">
        ${data.instagram || 'Not provided'}
      </span>
    </div>

    <div class="row">
      <span class="label">Service</span>
      <span class="value highlight">
        ${data.service}
      </span>
    </div>

    <div class="row">
      <span class="label">Package</span>
      <span class="value">
        ${pkgDisplay}
      </span>
    </div>

    <div class="row">
      <span class="label">Price</span>
      <span class="value success">
        ${priceDisplay}
      </span>
    </div>

    <div class="row">
      <span class="label">Event Date</span>
      <span class="value">
        ${formattedDate}
      </span>
    </div>

    ${
      formattedTime
        ? `
    <div class="row">
      <span class="label">Event Time</span>
      <span class="value">
        ${formattedTime}
      </span>
    </div>
    `
        : ''
    }

    <div class="row">
      <span class="label">City</span>
      <span class="value">
        ${data.city || 'N/A'}
      </span>
    </div>

    <div class="row">
      <span class="label">Venue</span>
      <span class="value">
        ${data.venue || 'N/A'}
      </span>
    </div>

    ${
      data.budget
        ? `
    <div class="row">
      <span class="label">Budget</span>
      <span class="value">
        ${data.budget}
      </span>
    </div>
    `
        : ''
    }

    <div class="details">
      <strong>Additional Details</strong>
      <br />
      ${data.eventDetails || 'None provided'}
    </div>

  </div>

  <div class="footer">
    LEOX Productions • ${this.adminEmail}
  </div>

</div>

</body>
</html>
`;

    return this.sendMail({
      to: this.adminEmail,
      subject: `🚨 [LEOX BOOKING] New Request from ${data.name}`,
      text: textBody,
      html,
    });
  }

  /**
   * ============================================================
   * CUSTOMER — BOOKING CONFIRMATION
   * ============================================================
   */
  public async sendBookingConfirmationCustomerEmail(data: {
    name: string;
    email: string;
    service: string;
    package?: string;
    eventDate: string;
    eventTime?: string;
    city: string;
    venue: string;
    bookingId: string;
  }) {
    const formattedDate =
      formatDisplayDate(data.eventDate) ||
      data.eventDate;

    const formattedTime =
      formatDisplayTime(data.eventTime);

    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />

<style>
body {
  margin: 0;
  padding: 0;
  background: #08080a;
  font-family: Arial, Helvetica, sans-serif;
  color: #ffffff;
}

.container {
  max-width: 600px;
  margin: 30px auto;
  background: #111217;
  border: 1px solid #252733;
  border-radius: 14px;
  overflow: hidden;
}

.header {
  background: #08080a;
  padding: 35px;
  text-align: center;
  border-bottom: 2px solid #E50914;
}

.logo {
  font-size: 32px;
  font-weight: 900;
  letter-spacing: 5px;
}

.logo span {
  color: #E50914;
}

.subtitle {
  margin-top: 8px;
  color: #9ca3af;
  font-size: 11px;
  letter-spacing: 2px;
}

.content {
  padding: 35px 30px;
}

.greeting {
    color: #ffffff;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 15px;
}

.text {
  color: #d1d5db;
  font-size: 14px;
  line-height: 1.7;
}

.card {
  margin: 25px 0;
  padding: 20px;
  background: #171821;
  border: 1px solid #282a36;
  border-radius: 10px;
}

.item {
  padding: 9px 0;
  font-size: 14px;
}

.label {
  color: #9ca3af;
}

.value {
  color: #ffffff;
  font-weight: 600;
}

.booking-id {
  color: #FF4D55;
  font-weight: 800;
}

.footer {
  padding: 25px;
  text-align: center;
  border-top: 1px solid #22242c;
  color: #6b7280;
  font-size: 12px;
}
</style>
</head>

<body>

<div class="container">

<div class="header">
  <img
    src="http://localhost:5173/assets/leox.png" 
    alt="LEOX" 
    style=" 
      display: block; 
      width: 150px; 
      max-width: 100%; 
      height: auto; 
      margin: 0 auto; 
    " 
  /> 
 
  <div class="subtitle"> 
    CINEMATIC PHOTOGRAPHY & REELS 
  </div> 
</div>

  <div class="content">

    <div class="greeting">
      Thank you, ${data.name}!
    </div>

    <div class="text">
      Your booking request has been successfully received by
      the LEOX production team.
    </div>

    <div class="card">

      <div class="item">
        <span class="label">Reference Code:</span>
        <span class="booking-id">
          #${data.bookingId}
        </span>
      </div>

      <div class="item">
        <span class="label">Service:</span>
        <span class="value">
          ${data.service}
        </span>
      </div>

      ${
        data.package
          ? `
      <div class="item">
        <span class="label">Package:</span>
        <span class="value">
          ${data.package}
        </span>
      </div>
      `
          : ''
      }

      <div class="item">
        <span class="label">Event Date:</span>
        <span class="value">
          ${formattedDate}
        </span>
      </div>

      ${
        formattedTime
          ? `
      <div class="item">
        <span class="label">Event Time:</span>
        <span class="value">
          ${formattedTime}
        </span>
      </div>
      `
          : ''
      }

      <div class="item">
        <span class="label">Location:</span>
        <span class="value">
          ${data.venue}, ${data.city}
        </span>
      </div>

    </div>

    <div class="text">
      Our team will review your booking request and contact you
      shortly to confirm the shoot details.
    </div>

  </div>

  <div class="footer">
    LEOX Productions • ${this.adminEmail}
  </div>

</div>

</body>
</html>
`;

    const text = `
Hi ${data.name},

Thank you for choosing LEOX.

Your booking request has been received.

Booking ID: #${data.bookingId}
Service: ${data.service}
${data.package ? `Package: ${data.package}` : ''}
Event Date: ${formattedDate}
${formattedTime ? `Event Time: ${formattedTime}` : ''}
Location: ${data.venue}, ${data.city}

Our team will contact you shortly to confirm the shoot details.

LEOX Productions
    `.trim();

    return this.sendMail({
      to: data.email.trim(),
      subject: `🎬 LEOX Booking Received - #${data.bookingId}`,
      text,
      html,
    });
  }

  /**
   * ============================================================
   * CONTACT FORM → ADMIN
   * ============================================================
   */
  public async sendContactNotification(data: {
    name: string;
    email: string;
    phone: string;
    service?: string;
    subject: string;
    message: string;
  }) {
    const safeMessage = (data.message || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br/>');

    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />

<style>
body {
  margin: 0;
  padding: 0;
  background: #08080a;
  font-family: Arial, Helvetica, sans-serif;
  color: #ffffff;
}

.container {
  max-width: 600px;
  margin: 30px auto;
  background: #111217;
  border: 1px solid #252733;
  border-radius: 14px;
  overflow: hidden;
}

.header {
  background: #08080a;
  padding: 28px;
  text-align: center;
  border-bottom: 2px solid #E50914;
}

.logo {
  font-size: 28px;
  font-weight: 900;
  letter-spacing: 5px;
}

.logo span {
  color: #E50914;
}

.content {
  padding: 30px;
}

.row {
  padding: 12px 0;
  border-bottom: 1px solid #22242c;
}

.label {
  display: block;
  color: #9ca3af;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 5px;
}

.value {
  color: #ffffff;
  font-size: 14px;
}

.message {
  margin-top: 20px;
  padding: 18px;
  background: #181a22;
  border-left: 3px solid #E50914;
  border-radius: 8px;
  line-height: 1.6;
}

.footer {
  padding: 20px;
  text-align: center;
  color: #6b7280;
  font-size: 12px;
  border-top: 1px solid #22242c;
}
</style>
</head>

<body>

<div class="container">

  <div class="header">
    <img
    src="http://localhost:5173/assets/leox.png"
    alt="LEOX"
    style="
      display: block;
      width: 150px;
      max-width: 100%;
      height: auto;
      margin: 0 auto;
    "
  />

    <p style="color:#9ca3af;font-size:11px;letter-spacing:2px;">
      NEW CONTACT ENQUIRY
    </p>
  </div>

  <div class="content">

    <div class="row">
      <span class="label">Name</span>
      <span class="value">${data.name}</span>
    </div>

    <div class="row">
      <span class="label">Email</span>
      <span class="value">${data.email}</span>
    </div>

    <div class="row">
      <span class="label">Phone</span>
      <span class="value">${data.phone || 'Not provided'}</span>
    </div>

    <div class="row">
      <span class="label">Service</span>
      <span class="value">
        ${data.service || 'General Enquiry'}
      </span>
    </div>

    <div class="row">
      <span class="label">Subject</span>
      <span class="value">
        ${data.subject || 'Website Enquiry'}
      </span>
    </div>

    <div class="message">
      <strong>Message / Event Details</strong>
      <br /><br />
      ${safeMessage}
    </div>

  </div>

  <div class="footer">
    LEOX Productions • ${this.adminEmail}
  </div>

</div>

</body>
</html>
`;

    return this.sendMail({
      to: this.adminEmail,
      subject: `💬 [LEOX ENQUIRY] ${
        data.subject || 'Website Message'
      } from ${data.name}`,
      text: `
NEW LEOX CONTACT ENQUIRY

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Service: ${data.service || 'General Enquiry'}
Subject: ${data.subject || 'Website Enquiry'}

Message:
${data.message}
      `.trim(),
      html,
    });
  }
}

export const emailService = new EmailService();
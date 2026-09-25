import React from 'react';
import { MessageCircle } from 'lucide-react';
import {
  getWhatsAppUrl,
} from '../../config/whatsapp';

export interface WhatsAppButtonProps {
  /** Custom prefilled message (falls back to WHATSAPP_CONFIG.defaultMessage) */
  message?: string;
  /** Custom WhatsApp number (falls back to configured business number) */
  number?: string;
  /** Button visual style */
  variant?: 'primary' | 'card' | 'outline' | 'icon' | 'pill';
  /** Custom button text */
  label?: string;
  /** Whether to display the formatted phone number alongside or below (deprecated/hidden for privacy) */
  showNumber?: boolean;
  /** Optional extra CSS classes */
  className?: string;
  /** HTML element ID for automated testing and targeting */
  id?: string;
  /** Whether to render as an inline element instead of block */
  inline?: boolean;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  message,
  number,
  variant = 'primary',
  label = 'Chat on WhatsApp',
  className = '',
  id,
  inline = false,
}) => {
  const url = getWhatsAppUrl({ message, number });

  // Icon-only button (e.g. for header or toolbars)
  if (variant === 'icon') {
    return (
      <a
        id={id || 'whatsapp-icon-btn'}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
        className={`p-2 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-all duration-200 inline-flex items-center justify-center ${className}`}
      >
        <MessageCircle className="w-4 h-4 text-[#25D366]" />
      </a>
    );
  }

  // Card variant (for contact info cards)
  if (variant === 'card') {
    return (
      <a
        id={id || 'whatsapp-card-link'}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-start gap-3.5 p-3.5 rounded-xl bg-[#102418] hover:bg-[#153020] border border-emerald-500/30 text-gray-200 transition-all duration-200 group shadow-lg shadow-emerald-950/20 ${className}`}
      >
        <div className="w-9 h-9 rounded-lg bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
          <MessageCircle className="w-5 h-5 text-[#25D366]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold">
              Instant Chat
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-sm font-semibold text-white mt-0.5 group-hover:text-emerald-300 transition-colors">
            {label}
          </div>
        </div>
      </a>
    );
  }

  // Compact Pill variant
  if (variant === 'pill') {
    return (
      <a
        id={id || 'whatsapp-pill-btn'}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 text-xs font-semibold tracking-wide transition-all ${className}`}
      >
        <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
        <span>{label}</span>
      </a>
    );
  }

  // Outline variant
  if (variant === 'outline') {
    return (
      <a
        id={id || 'whatsapp-outline-btn'}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${
          inline ? 'inline-flex' : 'flex'
        } items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/40 hover:border-[#25D366]/70 text-[#25D366] hover:text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md ${className}`}
      >
        <MessageCircle className="w-4 h-4 shrink-0" />
        <span>{label}</span>
      </a>
    );
  }

  // Default Primary Button
  return (
    <a
      id={id || 'whatsapp-primary-btn'}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${
        inline ? 'inline-flex' : 'flex'
      } items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-[#25D366]/25 hover:shadow-[#25D366]/40 hover:-translate-y-0.5 ${className}`}
    >
      <MessageCircle className="w-4 h-4 shrink-0 text-white" />
      <span>{label}</span>
    </a>
  );
};

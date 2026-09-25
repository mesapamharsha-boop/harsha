import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import {
  getWhatsAppUrl,
  WHATSAPP_CONFIG,
} from '../../config/whatsapp';
import { SiteSettings } from '../../types';

interface FloatingWhatsAppProps {
  /** Optional site settings with dynamic WhatsApp number */
  settings?: SiteSettings | null;
  /** Optional custom message overriding the default central message */
  customMessage?: string;
  /** Optional position adjustment if needed */
  className?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  settings,
  customMessage,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userCustomText, setUserCustomText] = useState('');

  const whatsAppNumber = settings?.whatsAppNumber?.trim() || undefined;
  const ownerName = settings?.ownerName?.trim() || WHATSAPP_CONFIG.directorName;
  const businessName = settings?.businessName?.trim() || WHATSAPP_CONFIG.businessName;

  const messageToSend = userCustomText.trim() || customMessage || WHATSAPP_CONFIG.defaultMessage;
  const targetUrl = getWhatsAppUrl({ message: messageToSend, number: whatsAppNumber });

  const handleSendDirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      const a = document.createElement('a');
      a.href = targetUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setIsOpen(false);
    }
  };

  return (
    <div
      id="floating-whatsapp-container"
      className={`fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-auto ${className}`}
    >
      {/* Popover Quick-Chat Dialog (Desktop/Mobile friendly) */}
      {isOpen && (
        <div
          id="whatsapp-chat-popover"
          className="mb-3 w-[calc(100vw-2rem)] sm:w-80 rounded-2xl bg-[#111218] border border-[#27293a] shadow-2xl shadow-black/80 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0d2818] via-[#103822] to-[#124227] p-4 border-b border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25D366] border-2 border-[#111218]" />
              </div>
              <div>
                <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span>{ownerName}</span>
                </div>
                <div className="text-[11px] text-emerald-300 font-mono flex items-center gap-1">
                  <span>Official WhatsApp</span>
                  <span className="text-[10px] text-emerald-400/70">&bull; Online</span>
                </div>
              </div>
            </div>

            <button
              id="close-whatsapp-popover-btn"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close WhatsApp chat preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-[#0c0d12] space-y-3">
            {/* Studio prompt speech bubble */}
            <div className="p-3 rounded-xl rounded-tl-none bg-[#171822] border border-[#232534] text-xs text-gray-200 leading-relaxed shadow-sm">
              <p className="font-semibold text-white mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Welcome to {businessName}!</span>
              </p>
              <p className="text-gray-300">
                Inquire about dates, pricing, or custom production requests directly on WhatsApp.
              </p>
            </div>

            {/* Default Message Preview & Custom input */}
            <form onSubmit={handleSendDirect} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Pre-filled message
                </label>
                <textarea
                  id="floating-whatsapp-custom-input"
                  rows={2}
                  value={userCustomText}
                  onChange={(e) => setUserCustomText(e.target.value)}
                  placeholder={WHATSAPP_CONFIG.defaultMessage}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#171822] border border-[#2a2c3f] text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-none"
                />
              </div>

              {/* Action Button */}
              <a
                id="floating-whatsapp-start-chat-btn"
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/30 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Start WhatsApp Chat</span>
              </a>

              <div className="text-[10px] text-center text-gray-400">
                Opens directly in WhatsApp app or WhatsApp Web
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <div className="flex items-center gap-2.5">
        {/* Hover Pill Label (visible on larger screens when popover is closed) */}
        {!isOpen && (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#111218] border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-xl shadow-black/80 pointer-events-none transition-all">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Chat on WhatsApp</span>
          </div>
        )}

        <button
          id="floating-whatsapp-trigger-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open WhatsApp contact chat"
          title="Chat on WhatsApp"
          className="relative group w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xl shadow-[#25D366]/35 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
        >
          {/* Subtle radar ripple ping */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 pointer-events-none" />

          {isOpen ? (
            <X className="w-6 h-6 text-white transition-transform duration-200" />
          ) : (
            <MessageCircle className="w-7 h-7 text-white transition-transform duration-200 group-hover:scale-110" />
          )}
        </button>
      </div>
    </div>
  );
};

import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#08080a] text-gray-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-[#20222f] pb-6">
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
            PRIVACY POLICY
          </h1>
          <p className="text-xs text-gray-400 mt-2">Effective Date: January 1, 2026 &bull; LEOX Media</p>
        </div>

        <section className="space-y-4 text-sm leading-relaxed">
          <h2 className="text-lg font-heading font-bold text-white">1. Information We Collect</h2>
          <p>
            When you submit a shoot inquiry or booking on the LEOX website, we collect your full name, phone number, email address, event dates, venues, guest estimations, and any specific creative briefs provided.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed">
          <h2 className="text-lg font-heading font-bold text-white">2. Use of Captured Media</h2>
          <p>
            Media captured during events is stored securely on encrypted offline production drives. Select photographs and video highlights may be showcased in the LEOX portfolio and official Instagram channel (@leox_shoots) in accordance with the signed client agreement.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed">
          <h2 className="text-lg font-heading font-bold text-white">3. Third-Party Sharing</h2>
          <p>
            We do not sell, rent, or trade your personal contact details to third-party marketing services. Contact information is strictly used by the LEOX crew for production coordination.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed">
          <h2 className="text-lg font-heading font-bold text-white">4. Contact & Inquiries</h2>
          <p>
            For any questions regarding your stored booking records or media rights, contact <span className="text-white font-semibold">leoxshoots@gmail.com</span>.
          </p>
        </section>
      </div>
    </div>
  );
};

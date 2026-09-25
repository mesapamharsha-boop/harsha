import React, { useState, useEffect } from 'react';
import { Service, Package } from '../types';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Send,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Sparkles,
  Tag,
} from 'lucide-react';
import { validateAndNormalizeCustomerWhatsApp } from '../config/whatsapp';
import { formatDisplayDate, formatDisplayTime } from '../utils/dateHelper';
import {
  EXACT_9_SERVICES,
  EXACT_PACKAGES,
  matchPackageSelection,
} from '../config/services';

interface BookingPageProps {
  services: Service[];
  packages: Package[];
  navigate: (path: string, state?: any) => void;
  urlParams: URLSearchParams;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  service?: string;
  eventDate?: string;
  city?: string;
  venue?: string;
}
const getCurrentTime = () => {
  const now = new Date();

  return now.toTimeString().slice(0, 5);
};

export const BookingPage: React.FC<BookingPageProps> = ({
  services: initialServices = [],
  packages: initialPackages = [],
  navigate,
  urlParams,
}) => {
  const { error, success } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<any | null>(null);

  // Dynamic services & packages state with fallback fetch if props empty
  const [servicesList, setServicesList] = useState<Service[]>(initialServices);
  const [packagesList, setPackagesList] = useState<Package[]>(initialPackages);

  useEffect(() => {
    if (initialServices && initialServices.length > 0) {
      setServicesList(initialServices);
    } else {
      api.getServices().then((res) => {
        if (res.services && res.services.length > 0) {
          setServicesList(res.services);
        }
      }).catch(() => {});
    }
  }, [initialServices]);

  useEffect(() => {
    if (initialPackages && initialPackages.length > 0) {
      setPackagesList(initialPackages);
    } else {
      api.getPackages().then((res) => {
        if (res.packages && res.packages.length > 0) {
          setPackagesList(res.packages);
        }
      }).catch(() => {});
    }
  }, [initialPackages]);

  // Read initial query params
  const initialService = urlParams.get('service') || '';
  const initialPkgMatch = matchPackageSelection(urlParams.get('package'));
  const initialCity = urlParams.get('city') || '';

const [formData, setFormData] = useState({
  fullName: '',
  phone: '',
  email: '',
  instagramHandle: '',
  service: initialService,
  package: initialPkgMatch.name,
  packagePrice: initialPkgMatch.price,
  eventDate: '',
  eventTime: '',
  city: initialCity,
  venue: '',
  eventDetails: '',
});

  const [errors, setErrors] = useState<FormErrors>({});

  // Sync initial package price if a package was passed in URL query
  useEffect(() => {
    const s = urlParams.get('service');
    const p = urlParams.get('package');
    const c = urlParams.get('city');

    if (s || p || c) {
      setFormData((prev) => {
        const pkgMatch = p ? matchPackageSelection(p) : { name: prev.package, price: prev.packagePrice };
        return {
          ...prev,
          ...(s ? { service: s } : {}),
          ...(p ? { package: pkgMatch.name, packagePrice: pkgMatch.price } : {}),
          ...(c ? { city: c } : {}),
        };
      });
    }
  }, [urlParams]);

  // Calculate today's date in YYYY-MM-DD for the minimum date picker limit
  const todayStr = new Date().toISOString().split('T')[0];

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear inline error immediately upon user edit
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePackageChange = (selectedPackageName: string) => {
    if (!selectedPackageName) {
      setFormData((prev) => ({
        ...prev,
        package: '',
        packagePrice: '',
      }));
      return;
    }

    const matched = EXACT_PACKAGES.find((p) => p.name === selectedPackageName);
    if (matched) {
      setFormData((prev) => ({
        ...prev,
        package: matched.name,
        packagePrice: matched.price,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        package: selectedPackageName,
        packagePrice: '',
      }));
    }
  };

  const validateForm = (): { isValid: boolean } => {
    const newErrors: FormErrors = {};

    // 1. Full Name *
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    }

    // 2. Phone / WhatsApp Number *
    const phoneResult = validateAndNormalizeCustomerWhatsApp(formData.phone);
    if (!phoneResult.isValid) {
      newErrors.phone = phoneResult.errorMessage || 'Please enter a valid phone / WhatsApp number.';
    }

    // 3. Email Address *
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // 4. Service Required *
    if (!formData.service.trim()) {
      newErrors.service = 'Please select a service.';
    }

    // 5. Event Date *
    if (!formData.eventDate.trim()) {
      newErrors.eventDate = 'Please select an event date.';
    }

    // 6. City / Location *
    if (!formData.city.trim()) {
      newErrors.city = 'Please enter your city/location.';
    }

    // 7. Venue Name / Address *
    if (!formData.venue.trim()) {
      newErrors.venue = 'Please enter the venue name / address.';
    }

    setErrors(newErrors);

    return {
      isValid: Object.keys(newErrors).length === 0,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid } = validateForm();

    if (!isValid) {
      error('Form Incomplete', 'Please check the required fields marked below.');
      return;
    }

    setSubmitting(true);

    try {
      // Backend submission:
      // - Validates booking data
      // - Saves to database with status: 'NEW'
      // - Automatically sends WhatsApp notification to business number
      // - Automatically sends email notification to leoxshoots@gmail.com
      // - Does NOT open WhatsApp on customer device
      const response = await api.createBooking({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim().toLowerCase(),
        instagramHandle: formData.instagramHandle.trim() || undefined,
        service: formData.service.trim(),
        package: formData.package ? formData.package.trim() : undefined,
        packagePrice: formData.packagePrice ? formData.packagePrice.trim() : undefined,
        eventDate: formData.eventDate.trim(),
        eventTime: formData.eventTime ? formData.eventTime.trim() : '',
        city: formData.city.trim(),
        venue: formData.venue.trim(),
        eventDetails: formData.eventDetails.trim() || undefined,
        status: 'NEW',
      });

      const confirmedBooking = response.booking || {
        ...formData,
        id: `LX-${Date.now().toString().slice(-6)}`,
        status: 'NEW',
        createdAt: new Date().toISOString(),
      };

      try {
        sessionStorage.setItem('last_booking', JSON.stringify(confirmedBooking));
      } catch {
        // ignore session storage limitations
      }

      const bookingId = confirmedBooking.id || confirmedBooking._id || 'CONFIRMED';

      setSubmittedBooking(confirmedBooking);

      success(
        'Booking Request Submitted Successfully',
        `Booking ID: #${bookingId}`
      );
    } catch (err: any) {
      console.error('[BookingSubmit] Error:', err);
      let errorTitle = 'Submission Failed';
      let errorMsg = 'Could not submit your booking. Please try again.';

      if (err?.status === 404) {
        errorTitle = 'API Route Not Found';
        errorMsg = 'The booking endpoint could not be reached (404). Please ensure the backend server is active.';
      } else if (err?.isNetworkError || err?.status === 0) {
        errorTitle = 'Backend Unavailable';
        errorMsg = 'Could not connect to the backend server. Please verify network connectivity.';
      } else if (err?.status === 400) {
        errorTitle = 'Validation Error';
        errorMsg = err.message || 'Please check your required fields and try again.';
      } else if (err?.status === 500) {
        errorTitle = 'Database / Server Error';
        errorMsg = err.message || 'The server encountered an error while saving your booking. Please try again.';
      } else if (err?.message) {
        errorMsg = err.message;
      }

      error(errorTitle, errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#08080a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E50914] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
            <span>RESERVE PRODUCTION CALENDAR</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-white leading-tight">
            BOOK A SHOOT WITH LEOX.
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">
            Lock in your event dates with South India&apos;s premier mobile cinematography and reel creator.
            Complete the form below to submit your booking request.
          </p>
        </div>

        {/* Confirmation Screen */}
        {submittedBooking ? (
          <div className="rounded-3xl bg-[#111218] border border-[#232535] p-8 sm:p-12 shadow-2xl space-y-8 animate-fadeIn">
            <div className="text-center space-y-4 max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
                Booking Request Submitted Successfully
              </h2>
              <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-sm">
                Booking ID: #{submittedBooking.id || submittedBooking._id || 'NEW'}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Thank you, <span className="text-white font-bold">{submittedBooking.fullName}</span>.
                Your booking request has been submitted successfully and our team will contact you shortly to confirm the shoot.
              </p>
            </div>

            {/* Summary Ticket */}
            <div className="p-6 rounded-2xl bg-[#161722] border border-[#27293a] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#232535] gap-2">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold block">
                    Booking ID
                  </span>
                  <span className="text-base font-mono font-bold text-white">
                    #{submittedBooking.id || submittedBooking._id || 'NEW'}
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Status: NEW (Confirmation Pending)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-400 font-bold block">Service Required</span>
                    <span className="text-white font-semibold">{submittedBooking.service}</span>
                    {submittedBooking.package && (
                      <span className="text-[11px] text-[#FF4D55] block">
                        Package: {submittedBooking.package}
                        {submittedBooking.packagePrice ? ` (${submittedBooking.packagePrice})` : ''}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-400 font-bold block">Event Date & Time</span>
                    <span className="text-white font-semibold">
                      {formatDisplayDate(submittedBooking.eventDate) || submittedBooking.eventDate}
                      {submittedBooking.eventTime ? ` at ${formatDisplayTime(submittedBooking.eventTime)}` : ''}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-400 font-bold block">Location & Venue</span>
                    <span className="text-white font-semibold">
                      {submittedBooking.city} &bull; {submittedBooking.venue}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-400 font-bold block">Client Contact</span>
                    <span className="text-white font-semibold">{submittedBooking.phone}</span>
                    <span className="text-gray-400 text-[11px] block">{submittedBooking.email}</span>
                    {submittedBooking.instagramHandle && (
                      <span className="text-gray-400 text-[11px] block">
                        Instagram: @{submittedBooking.instagramHandle.replace(/^@/, '')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {submittedBooking.eventDetails && (
                <div className="pt-3 border-t border-[#232535] text-xs">
                  <span className="text-gray-400 font-bold block mb-1">Additional Details:</span>
                  <p className="text-gray-200 leading-relaxed bg-[#111218] p-3 rounded-xl border border-[#20222f]">
                    {submittedBooking.eventDetails}
                  </p>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setSubmittedBooking(null);
                  setFormData({
                    fullName: '',
                    phone: '',
                    email: '',
                    instagramHandle: '',
                    service: '',
                    package: '',
                    packagePrice: '',
                    eventDate: '',
                    eventTime: '',
                    city: '',
                    venue: '',
                    eventDetails: '',
                  });
                  setErrors({});
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Book Another Shoot
              </button>

              <button
                type="button"
                onClick={() => navigate('/packages')}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#E50914] hover:bg-[#FF2E36] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#E50914]/30 cursor-pointer"
              >
                Explore Packages
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form Card */
          <div className="rounded-3xl bg-[#111218] border border-[#222432] p-6 sm:p-12 shadow-2xl">
            <form onSubmit={handleSubmit} noValidate className="space-y-8">
              {/* 01. CONTACT INFORMATION */}
              <div>
                <h3 className="text-base font-heading font-bold text-white mb-4 pb-2 border-b border-[#20222f] flex items-center gap-2">
                  <span className="text-[#E50914]">01.</span> Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      className={`w-full px-4 py-3 rounded-xl bg-[#171822] border text-white text-sm focus:outline-none transition-colors ${
                        errors.fullName
                          ? 'border-[#E50914] focus:border-[#FF4D55]'
                          : 'border-[#27293a] focus:border-[#E50914]'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="mt-1.5 text-xs text-[#FF4D55] flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.fullName}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone / WhatsApp Number */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="Enter your phone / WhatsApp number"
                      className={`w-full px-4 py-3 rounded-xl bg-[#171822] border text-white text-sm focus:outline-none transition-colors ${
                        errors.phone
                          ? 'border-[#E50914] focus:border-[#FF4D55]'
                          : 'border-[#27293a] focus:border-[#E50914]'
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1.5 text-xs text-[#FF4D55] flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="Enter your email address"
                      className={`w-full px-4 py-3 rounded-xl bg-[#171822] border text-white text-sm focus:outline-none transition-colors ${
                        errors.email
                          ? 'border-[#E50914] focus:border-[#FF4D55]'
                          : 'border-[#27293a] focus:border-[#E50914]'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-[#FF4D55] flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Instagram Handle */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Instagram Handle (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.instagramHandle}
                      onChange={(e) => handleChange('instagramHandle', e.target.value)}
                      placeholder="Enter your Instagram handle"
                      className="w-full px-4 py-3 rounded-xl bg-[#171822] border border-[#27293a] text-white text-sm focus:outline-none focus:border-[#E50914] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* 02. EVENT & SCHEDULE */}
              <div>
                <h3 className="text-base font-heading font-bold text-white mb-4 pb-2 border-b border-[#20222f] flex items-center gap-2">
                  <span className="text-[#E50914]">02.</span> Event & Schedule
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Service Required * */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Service Required *
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => handleChange('service', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl bg-[#171822] border text-white text-sm focus:outline-none transition-colors ${
                        errors.service
                          ? 'border-[#E50914] focus:border-[#FF4D55]'
                          : 'border-[#27293a] focus:border-[#E50914]'
                      }`}
                    >
                      <option value="">Select a service...</option>
                      {EXACT_9_SERVICES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {errors.service && (
                      <p className="mt-1.5 text-xs text-[#FF4D55] flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.service}</span>
                      </p>
                    )}
                  </div>

                  {/* Package Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                        Package Selection 
                      </label>
                      {formData.packagePrice && (
                        <span className="text-[11px] font-bold text-[#E50914] flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          <span>{formData.packagePrice}</span>
                        </span>
                      )}
                    </div>
                    <select
                      value={formData.package}
                      onChange={(e) => handlePackageChange(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#171822] border border-[#27293a] text-white text-sm focus:outline-none focus:border-[#E50914] transition-colors"
                    >
                      <option value="">Select package </option>
                      {EXACT_PACKAGES.map((pkg) => (
                        <option key={pkg.name} value={pkg.name}>
                          {pkg.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Event Date * */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={todayStr}
                      value={formData.eventDate}
                      onChange={(e) => handleChange('eventDate', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl bg-[#171822] border text-white text-sm [color-scheme:dark] focus:outline-none transition-colors ${
                        errors.eventDate
                          ? 'border-[#E50914] focus:border-[#FF4D55]'
                          : 'border-[#27293a] focus:border-[#E50914]'
                      }`}
                    />
                    {errors.eventDate && (
                      <p className="mt-1.5 text-xs text-[#FF4D55] flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.eventDate}</span>
                      </p>
                    )}
                  </div>

                  {/* Event Time (Optional) */}
{/* Event Time */}
<div>
  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
    Event Time (Optional)
  </label>

  <input
    type="text"
    value={formData.eventTime}
    onChange={(e) => handleChange('eventTime', e.target.value)}
    placeholder=""
    className="w-full px-4 py-3 rounded-xl bg-[#171822] border border-[#27293a] text-white text-sm focus:outline-none focus:border-[#E50914] transition-colors"
  />
</div>

                  {/* City / Location * */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      City / Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      placeholder="Enter city or location (e.g. Hyderabad, Vijayawada, Vizag)"
                      className={`w-full px-4 py-3 rounded-xl bg-[#171822] border text-white text-sm focus:outline-none transition-colors ${
                        errors.city
                          ? 'border-[#E50914] focus:border-[#FF4D55]'
                          : 'border-[#27293a] focus:border-[#E50914]'
                      }`}
                    />
                    {errors.city && (
                      <p className="mt-1.5 text-xs text-[#FF4D55] flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.city}</span>
                      </p>
                    )}
                  </div>

                  {/* Venue Name / Address * */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Venue Name / Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.venue}
                      onChange={(e) => handleChange('venue', e.target.value)}
                      placeholder="Enter venue name or address"
                      className={`w-full px-4 py-3 rounded-xl bg-[#171822] border text-white text-sm focus:outline-none transition-colors ${
                        errors.venue
                          ? 'border-[#E50914] focus:border-[#FF4D55]'
                          : 'border-[#27293a] focus:border-[#E50914]'
                      }`}
                    />
                    {errors.venue && (
                      <p className="mt-1.5 text-xs text-[#FF4D55] flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.venue}</span>
                      </p>
                    )}
                  </div>

                  {/* Additional Details (Optional) */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Additional Details / Event Vision (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.eventDetails}
                      onChange={(e) => handleChange('eventDetails', e.target.value)}
                      placeholder="Tell us about your event vision, schedule, or specific requirements..."
                      className="w-full px-4 py-3 rounded-xl bg-[#171822] border border-[#27293a] text-white text-sm focus:outline-none focus:border-[#E50914] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Bar */}
              <div className="pt-6 border-t border-[#20222f] flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-gray-400">
                  Our production crew reviews availability and confirms your shoot within 24 hours.
                </p>

                <button
                  type="submit"
                  disabled={submitting}
                  id="submit-booking-btn"
                  className="w-full sm:w-auto px-10 py-4 rounded-xl bg-[#E50914] hover:bg-[#FF2E36] text-white font-bold text-xs uppercase tracking-widest transition-all duration-200 shadow-xl shadow-[#E50914]/30 flex items-center justify-center gap-2.5 disabled:opacity-50 hover:-translate-y-0.5 cursor-pointer"
                >
                  {submitting ? (
                    <span>SUBMITTING BOOKING...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>SUBMIT BOOKING REQUEST</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

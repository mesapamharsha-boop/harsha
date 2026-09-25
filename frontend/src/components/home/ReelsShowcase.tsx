import React, { useRef, useState } from 'react';
import { Reel } from '../../types';
import { Modal } from '../common/Modal';
import {
  Play,
  Instagram,
  Eye,
  MapPin,
  ArrowRight,
  VolumeX,
} from 'lucide-react';

interface ReelsShowcaseProps {
  reels: Reel[];
  navigate: (path: string) => void;
}

export const ReelsShowcase: React.FC<ReelsShowcaseProps> = ({
  reels,
  navigate,
}) => {
  const [activeReel, setActiveReel] = useState<Reel | null>(null);

  const visibleReels = reels.slice(0, 5);

  return (
    <section className="py-24 bg-[#08080a] border-t border-[#171822] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E50914] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
              <span>VERTICAL REVOLUTION</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-white">
              VIRAL 9:16 REELS.
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/leox_shoots/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-bold text-gray-200 hover:text-white transition-colors"
            >
              <Instagram className="w-4 h-4 text-[#E50914]" />
              <span>Follow @leox_shoots</span>
            </a>

            <button
              onClick={() => navigate('/reels')}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-[#E50914] transition-colors"
            >
              <span>ALL REELS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* No reels */}
        {visibleReels.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-500 text-sm">
              Reels coming soon.
            </p>
          </div>
        )}

        {/* 9:16 Video Cards */}
        {visibleReels.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {visibleReels.map((reel) => (
              <ReelVideoCard
                key={reel.id || reel._id || reel.videoUrl}
                reel={reel}
                onClick={() => setActiveReel(reel)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reel Playback Modal */}
      <Modal
        isOpen={Boolean(activeReel)}
        onClose={() => setActiveReel(null)}
        title={activeReel?.title}
        maxWidth="lg"
      >
        {activeReel && (
          <div className="space-y-5">

            {/* Actual Video */}
            <div className="relative aspect-[9/16] max-h-[70vh] mx-auto rounded-xl overflow-hidden bg-black border border-[#222432] shadow-2xl flex items-center justify-center">
              {activeReel.videoUrl ? (
                <video
                  key={activeReel.videoUrl}
                  src={activeReel.videoUrl}
                  poster={activeReel.thumbnail}
                  controls
                  autoPlay
                  playsInline
                  loop
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={activeReel.thumbnail}
                  alt={activeReel.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Reel Meta */}
            <div className="space-y-2 text-center">
              {(activeReel.eventName || activeReel.city) && (
                <div className="text-xs text-[#E50914] font-bold uppercase tracking-wider">
                  {activeReel.eventName}
                  {activeReel.eventName && activeReel.city ? ' • ' : ''}
                  {activeReel.city}
                </div>
              )}

              <h3 className="text-lg font-heading font-bold text-white">
                {activeReel.title}
              </h3>

              {activeReel.description && (
                <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
                  {activeReel.description}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="pt-4 border-t border-[#222432] flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={
                  activeReel.instagramUrl ||
                  'https://www.instagram.com/leox_shoots/'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
              >
                <Instagram className="w-4 h-4" />
                <span>Watch on Instagram</span>
              </a>

              <button
                onClick={() => {
                  const serviceParam = encodeURIComponent(
                    'Instagram Reels & Short-Form Content'
                  );

                  setActiveReel(null);
                  navigate(`/book?service=${serviceParam}`);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#FF2E36] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#E50914]/30"
              >
                Book Reel Shoot
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

/* =========================================================
   REEL VIDEO CARD
========================================================= */

interface ReelVideoCardProps {
  reel: Reel;
  onClick: () => void;
}

const ReelVideoCard: React.FC<ReelVideoCardProps> = ({
  reel,
  onClick,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseEnter = async () => {
    const video = videoRef.current;

    if (!video || !reel.videoUrl) return;

    try {
      video.currentTime = 0;
      await video.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const handleMouseLeave = () => {
    const video = videoRef.current;

    if (!video) return;

    video.pause();
    video.currentTime = 0;
    setIsPlaying(false);
  };

  return (
    <div
      className="
        group
        relative
        rounded-2xl
        overflow-hidden
        bg-[#111217]
        border
        border-[#232532]
        hover:border-[#E50914]
        transition-all
        duration-300
        flex
        flex-col
        aspect-[9/16]
        shadow-2xl
        hover:-translate-y-2
        cursor-pointer
      "
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* =====================================================
          ACTUAL CLOUDINARY VIDEO
      ===================================================== */}
      {reel.videoUrl ? (
        <video
          ref={videoRef}
          src={reel.videoUrl}
          poster={reel.thumbnail}
          muted
          loop
          playsInline
          preload="metadata"
          className="
            absolute
            inset-0
            w-full
            h-full
            object-cover
            transition-transform
            duration-700
            group-hover:scale-105
          "
        />
      ) : (
        <img
          src={reel.thumbnail}
          alt={reel.title}
          className="
            absolute
            inset-0
            w-full
            h-full
            object-cover
          "
        />
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 pointer-events-none" />

      {/* Top Bar */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] text-white/90 pointer-events-none">
        {reel.views && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 font-bold">
            <Eye className="w-3 h-3 text-[#E50914]" />
            <span>{reel.views}</span>
          </span>
        )}

        <span className="ml-auto w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/10 text-[#FF3842]">
          <Instagram className="w-3.5 h-3.5" />
        </span>
      </div>

      {/* Play / Playing Indicator */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {!isPlaying && (
          <div className="w-12 h-12 rounded-full bg-[#E50914]/90 text-white flex items-center justify-center shadow-xl shadow-[#E50914]/50 scale-90 group-hover:scale-110 transition-transform duration-300">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        )}

        {isPlaying && (
          <div className="absolute top-14 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/10">
            <VolumeX className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Bottom Information */}
      <div className="absolute bottom-3 left-3 right-3 space-y-1 pointer-events-none">
        {reel.eventName && (
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#FF4D55]">
            {reel.eventName}
          </div>
        )}

        <h3 className="text-xs sm:text-sm font-heading font-bold text-white line-clamp-2 leading-snug">
          {reel.title}
        </h3>

        {(reel.city || reel.eventDate) && (
          <div className="flex items-center gap-1 text-[10px] text-gray-400 pt-0.5">
            <MapPin className="w-3 h-3 text-gray-500" />

            <span className="truncate">
              {reel.city}
              {reel.city && reel.eventDate ? ' • ' : ''}
              {reel.eventDate}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
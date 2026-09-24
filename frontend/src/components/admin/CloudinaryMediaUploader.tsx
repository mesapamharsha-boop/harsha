import React, { useState, useRef } from 'react';
import { api } from '../../services/api';
import {
  UploadCloud,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Play,
  Image as ImageIcon,
  Film,
  RefreshCw,
} from 'lucide-react';

interface CloudinaryMediaUploaderProps {
  label: string;
  value?: string;
  onChange: (url: string, meta?: { publicId?: string; resourceType?: string }) => void;
  accept?: 'image' | 'video' | 'both';
  aspectRatio?: 'video' | 'reel' | 'square' | 'auto';
  required?: boolean;
  helpText?: string;
  className?: string;
}

export const CloudinaryMediaUploader: React.FC<CloudinaryMediaUploaderProps> = ({
  label,
  value,
  onChange,
  accept = 'image',
  aspectRatio = 'auto',
  required = false,
  helpText,
  className = '',
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isVideo =
    accept === 'video' ||
    (value && (value.includes('/video/upload/') || /\.(mp4|webm|mov|mkv)($|\?)/i.test(value)));

  const acceptAttribute =
    accept === 'video'
      ? 'video/mp4,video/quicktime,video/webm'
      : accept === 'image'
      ? 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml'
      : 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml,video/mp4,video/quicktime,video/webm';

  const handleFile = async (file: File) => {
    // Basic frontend size check
    const isVid = file.type.startsWith('video/');
    const maxSizeBytes = isVid ? 100 * 1024 * 1024 : 30 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setUploadStatus('error');
      setErrorMessage(`File is too large (max ${isVid ? '100MB' : '30MB'}).`);
      return;
    }

    setUploading(true);
    setUploadStatus('idle');
    setErrorMessage(null);

    try {
      const resourceType = isVid ? 'video' : 'image';
      const result = await api.uploadMedia(file, resourceType);

      if (result.secure_url || result.url) {
        const finalUrl = result.secure_url || result.url;
        onChange(finalUrl, {
          publicId: result.publicId,
          resourceType: result.resourceType || resourceType,
        });
        setUploadStatus('success');
      } else {
        throw new Error('Upload succeeded but no Cloudinary URL was returned.');
      }
    } catch (err: any) {
      console.error('[CloudinaryUpload] Upload error:', err);
      setUploadStatus('error');
      setErrorMessage(
        err?.message || 'Failed to upload to Cloudinary. Please check backend credentials.'
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setUploadStatus('idle');
    setErrorMessage(null);
  };

  const aspectClass =
    aspectRatio === 'reel'
      ? 'aspect-[9/16] max-w-[200px]'
      : aspectRatio === 'video'
      ? 'aspect-video'
      : aspectRatio === 'square'
      ? 'aspect-square max-w-[240px]'
      : 'min-h-[160px]';

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <label className="block text-gray-300 font-bold text-xs tracking-wide">
          {label} {required && <span className="text-[#E50914]">*</span>}
        </label>
        {value && (
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Cloudinary Ready
          </span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptAttribute}
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Media Preview State */}
      {value && !uploading ? (
        <div
          className={`relative rounded-xl overflow-hidden border border-[#262838] bg-[#0e0f16] group ${aspectClass} mx-auto`}
        >
          {isVideo ? (
            <video
              src={value}
              controls
              playsInline
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <img
              src={value}
              alt="Uploaded Preview"
              className="w-full h-full object-cover rounded-xl"
            />
          )}

          {/* Action overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center gap-1.5 backdrop-blur-sm transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replace</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-xs font-semibold flex items-center gap-1.5 backdrop-blur-sm transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        /* Upload Drag & Drop / Select Area */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200 ${
            isDragOver
              ? 'border-[#E50914] bg-[#E50914]/10'
              : 'border-[#27293a] bg-[#141520] hover:border-gray-500 hover:bg-[#181926]'
          } ${uploading ? 'pointer-events-none opacity-80' : ''}`}
        >
          <div className="flex flex-col items-center justify-center space-y-2.5">
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 text-[#E50914] animate-spin" />
                <div>
                  <p className="text-xs font-bold text-white">Uploading to Cloudinary...</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Processing media securely on cloud storage
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-gray-300">
                  {accept === 'video' ? (
                    <Film className="w-5 h-5 text-[#E50914]" />
                  ) : (
                    <UploadCloud className="w-5 h-5 text-[#E50914]" />
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-lg bg-[#E50914] hover:bg-[#FF2E36] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md"
                    >
                      {accept === 'video' ? (
                        <>
                          <Film className="w-3.5 h-3.5" />
                          <span>Upload Video</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Upload Image</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    or drag and drop file from your computer
                  </p>
                </div>

                <p className="text-[10px] text-gray-500">
                  {accept === 'video'
                    ? 'MP4, WebM, MOV up to 100MB'
                    : accept === 'both'
                    ? 'JPG, PNG, WebP, MP4 up to 100MB'
                    : 'JPG, PNG, WebP, GIF up to 30MB'}
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Success Notification */}
      {uploadStatus === 'success' && !uploading && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 px-3 py-1.5 rounded-lg">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Upload successful. Media is hosted on Cloudinary and ready to save.</span>
        </div>
      )}

      {/* Error Notification */}
      {uploadStatus === 'error' && !uploading && (
        <div className="flex items-start gap-1.5 text-xs text-red-400 bg-red-950/40 border border-red-800/50 p-2.5 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Upload failed</p>
            <p className="text-[11px] text-red-300/80">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-[10px] uppercase font-bold text-white bg-red-800/80 hover:bg-red-700 px-2 py-1 rounded"
          >
            Retry
          </button>
        </div>
      )}

      {helpText && !errorMessage && (
        <p className="text-[10px] text-gray-400">{helpText}</p>
      )}
    </div>
  );
};

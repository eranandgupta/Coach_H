'use client';

import { useState, useRef } from 'react';
import { upload } from '@imagekit/next';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageKitUploadProps {
  onUploadSuccess: (url: string) => void;
  folder?: string;
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  currentImageUrl?: string;
  onRemove?: () => void;
  className?: string;
}

export default function ImageKitUpload({
  onUploadSuccess,
  folder = '/uploads',
  label = 'Upload Image',
  accept = 'image/*',
  maxSizeMB = 10,
  currentImageUrl,
  onRemove,
  className = '',
}: ImageKitUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const authenticator = async () => {
    const res = await fetch('/api/imagekit/auth');
    if (!res.ok) throw new Error('Auth failed');
    return res.json();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setUploading(true);
    try {
      const authParams = await authenticator();

      const result = await upload({
        file,
        fileName: file.name,
        folder,
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
        ...authParams,
      });

      if (result?.url) {
        onUploadSuccess(result.url);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      // Reset input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (currentImageUrl) {
    return (
      <div className={`relative inline-block ${className}`}>
        <img
          src={currentImageUrl}
          alt="Uploaded"
          className="w-full max-w-xs h-48 object-cover rounded-xl border-2 border-brand-gold/50"
        />
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X size={16} className="text-white" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <label className="block w-full px-4 py-6 bg-brand-navy border-2 border-dashed border-brand-navy-light/50 rounded-xl hover:border-brand-gold/50 transition-colors cursor-pointer">
        <div className="flex flex-col items-center gap-2">
          {uploading ? (
            <>
              <Loader2 className="text-brand-gold animate-spin" size={32} />
              <span className="text-gray-300 text-sm">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="text-brand-gold" size={32} />
              <span className="text-gray-300 text-sm">{label}</span>
              <span className="text-gray-500 text-xs">Max {maxSizeMB}MB</span>
            </>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
      </label>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

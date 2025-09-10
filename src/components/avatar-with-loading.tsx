"use client";

import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils";

// Simple in-memory cache for image loading status
const imageCache = new Map<string, { status: 'loading' | 'loaded' | 'error'; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedImageStatus = (src: string) => {
  const cached = imageCache.get(src);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.status;
  }
  return null;
};

const setCachedImageStatus = (src: string, status: 'loading' | 'loaded' | 'error') => {
  imageCache.set(src, { status, timestamp: Date.now() });
};

interface AvatarWithLoadingProps {
  src?: string | null;
  alt: string;
  fallback: string;
  className?: string;
  fallbackClassName?: string;
}

export const AvatarWithLoading = ({
  src,
  alt,
  fallback,
  className,
  fallbackClassName,
}: AvatarWithLoadingProps) => {
  const [isImageLoading, setIsImageLoading] = useState(() => {
    if (!src) return false;
    const cachedStatus = getCachedImageStatus(src);
    return cachedStatus === 'loading' || cachedStatus === null;
  });
  const [imageError, setImageError] = useState(() => {
    if (!src) return false;
    const cachedStatus = getCachedImageStatus(src);
    return cachedStatus === 'error';
  });

  const handleImageLoad = () => {
    setIsImageLoading(false);
    if (src) {
      setCachedImageStatus(src, 'loaded');
    }
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setImageError(true);
    if (src) {
      setCachedImageStatus(src, 'error');
    }
  };

  // Reset states when src changes
  useEffect(() => {
    if (src) {
      const cachedStatus = getCachedImageStatus(src);
      if (cachedStatus === 'loaded') {
        setIsImageLoading(false);
        setImageError(false);
      } else if (cachedStatus === 'error') {
        setIsImageLoading(false);
        setImageError(true);
      } else {
        setIsImageLoading(true);
        setImageError(false);
        setCachedImageStatus(src, 'loading');
      }
    } else {
      setIsImageLoading(false);
      setImageError(false);
    }
  }, [src]);

  // Add timeout fallback for loading state
  useEffect(() => {
    if (src && isImageLoading && !imageError) {
      const timeout = setTimeout(() => {
        setIsImageLoading(false);
        setImageError(true);
        setCachedImageStatus(src, 'error');
      }, 3000); // 3 seconds timeout

      return () => clearTimeout(timeout);
    }
  }, [src, isImageLoading, imageError]);

  return (
    <Avatar className={className}>
      {src && !imageError && (
        <AvatarImage
          src={src}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
      <AvatarFallback className={cn(fallbackClassName)}>
        {isImageLoading && src && !imageError ? (
          <LoadingSpinner size="sm" className="text-gray-400" />
        ) : (
          fallback
        )}
      </AvatarFallback>
    </Avatar>
  );
};

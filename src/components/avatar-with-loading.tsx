"use client";

import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils";

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
  const [isImageLoading, setIsImageLoading] = useState(!!src);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setImageError(true);
  };

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

"use client";

import { Cookie, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { MotionDiv } from "@/components/motion-wrapper";
import { Button } from "@/components/ui/button";

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieConsent = localStorage.getItem("cookie-consent");
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <MotionDiv
      initial={{ y: 100, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 100, opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md z-50"
    >
      <div className="relative backdrop-blur-md bg-white/80 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
        {/* Gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-2xl opacity-50"></div>

        <div className="relative p-5">
          {/* Header with icon and close button */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Cookie className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                Cookie Notice
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {/* Content */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            We use cookies to enhance your browsing experience and analyze site
            traffic. By continuing, you consent to our use of cookies.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              size="sm"
              className="text-sm py-2 sm:py-2 px-4 border-border/50 hover:border-border hover:bg-muted/50 transition-colors"
              asChild
              onClick={handleClose}
            >
              <Link href="/cookie-policy" className="flex-1 sm:flex-none">
                Learn More
              </Link>
            </Button>
            <Button
              size="sm"
              className="text-sm py-2 sm:py-2 px-4 bg-primary hover:bg-primary/90 transition-colors flex-1 sm:flex-none"
              onClick={handleAccept}
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </MotionDiv>
  );
};

export { CookieBanner };

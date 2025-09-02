"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

//import { MotionDiv, MotionH1, MotionP } from "@/components/motion-wrapper";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import { siteConfig } from "@/config/site";

interface SignInDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

const SignInDialog = ({
  trigger,
  open,
  onOpenChange,
  onSuccess,
}: SignInDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [internalOpen, setInternalOpen] = useState(false);

  // 使用受控模式或内部状态
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
      
      // 登录成功后关闭弹窗并执行回调
      setIsOpen(false);
      onSuccess?.();
    } catch {
      setError("Google sign in failed, please try again");
      setIsLoading(false);
    }
  };

  const dialogContent = (
    <DialogContent className="sm:max-w-md">
      <DialogHeader className="space-y-3 text-center">
        <DialogTitle className="text-xl font-bold text-center">
          Welcome to {siteConfig.name}
        </DialogTitle>
        <p className="text-muted-foreground text-sm text-center">
          Sign in with your Google account to start your AI creative journey
        </p>
      </DialogHeader>

      <div className="space-y-6 mt-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          type="button"
          variant="outline"
          className="w-full h-10 text-sm font-medium bg-white hover:bg-gray-50 text-gray-900 border-gray-300 flex items-center justify-center"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-gray-600" />
          ) : (
            <FcGoogle className="mr-2 h-4 w-4" />
          )}
          {isLoading ? "Signing in..." : "Sign in with Google"}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </DialogContent>
  );

  if (trigger) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <div onClick={() => setIsOpen(true)}>{trigger}</div>
        {dialogContent}
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {dialogContent}
    </Dialog>
  );
};

export { SignInDialog };
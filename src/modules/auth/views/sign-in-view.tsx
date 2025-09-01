"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { FaGoogle } from "react-icons/fa";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MotionDiv, MotionH1, MotionP } from "@/components/motion-wrapper";
import { authClient } from "@/lib/auth-client";

interface SignInViewProps {
  // 预留给未来可能的 props
}

const SignInView = ({}: SignInViewProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      setError("Google sign in failed, please try again");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg">
          <CardHeader className="space-y-4 text-center">
            <MotionH1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-2xl font-bold"
            >
              Welcome to AI SaaS
            </MotionH1>
            <MotionP
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-muted-foreground"
            >
              Sign in with your Google account to start your AI creative journey
            </MotionP>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <MotionDiv
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </MotionDiv>
            )}

            <MotionDiv
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Button
                type="button"
                className="w-full h-12 text-base font-medium transition-all duration-200 hover:scale-105"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <FaGoogle className="mr-2 h-5 w-5" />
                )}
                {isLoading ? "Signing in..." : "Sign in with Google"}
              </Button>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="text-center text-xs text-muted-foreground"
            >
              By signing in, you agree to our Terms of Service and Privacy Policy
            </MotionDiv>
          </CardContent>
        </Card>
      </MotionDiv>
    </div>
  );
};

export default SignInView;
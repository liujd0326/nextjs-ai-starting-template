"use client";

import {
  Clock,
  ExternalLink,
  FileText,
  Mail,
  MessageSquare,
} from "lucide-react";

import {
  MotionDiv,
  MotionH1,
  MotionSection,
} from "@/components/motion-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";

export const ContactView = () => {
  const mailtoLink = `mailto:${siteConfig.contact.email}?subject=Support Request - ${siteConfig.name}&body=Hello,%0D%0A%0D%0APlease describe your issue or question:%0D%0A%0D%0A`;

  const helpLinks = [
    {
      title: "Pricing Information",
      description: "View our plans and pricing options",
      href: "/pricing",
      icon: FileText,
    },
    {
      title: "Privacy Policy",
      description: "Learn how we protect your data",
      href: "/privacy-policy",
      icon: FileText,
    },
    {
      title: "Terms of Service",
      description: "Review our terms and conditions",
      href: "/terms-of-service",
      icon: FileText,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <MotionSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <MotionH1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Contact Us
          </MotionH1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Need help or have questions? We&apos;re here to assist you with your
            AI image generation needs.
          </p>
        </MotionSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <MotionDiv
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm h-full">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Get in Touch
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Email Contact */}
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Email Support
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        Send us an email and we&apos;ll get back to you as soon
                        as possible.
                      </p>
                      <Button asChild className="w-full">
                        <a href={mailtoLink}>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email
                        </a>
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Response Time */}
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Clock className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Response Time
                      </h3>
                      <p className="text-gray-600 text-sm">
                        We typically respond within{" "}
                        <span className="font-medium text-green-600">
                          {siteConfig.contact.supportResponseTime}
                        </span>
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Business Hours */}
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <MessageSquare className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Support Hours
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Monday - Friday: 9:00 AM - 6:00 PM (UTC)
                        <br />
                        Weekend: Limited support available
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </MotionDiv>

          {/* Quick Help */}
          <MotionDiv
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm h-full">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Quick Help
                  </h2>
                </div>

                <p className="text-gray-600 mb-6">
                  Before reaching out, you might find answers in our helpful
                  resources:
                </p>

                <div className="space-y-4">
                  {helpLinks.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <MotionDiv
                        key={link.href}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      >
                        <Button
                          variant="ghost"
                          asChild
                          className="w-full justify-start h-auto p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                        >
                          <a href={link.href}>
                            <div className="flex items-start space-x-3">
                              <Icon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div className="text-left">
                                <h4 className="font-medium text-gray-900 mb-1">
                                  {link.title}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {link.description}
                                </p>
                              </div>
                              <ExternalLink className="w-4 h-4 text-gray-400 ml-auto flex-shrink-0" />
                            </div>
                          </a>
                        </Button>
                      </MotionDiv>
                    );
                  })}
                </div>

                {/* Emergency Note */}
                <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-3 h-3 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-amber-800 mb-1">
                        Need Immediate Help?
                      </h4>
                      <p className="text-sm text-amber-700">
                        For urgent issues, please include &quot;URGENT&quot; in
                        your email subject line. We&apos;ll prioritize these
                        requests.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </MotionDiv>
        </div>

        {/* Additional Info */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12"
        >
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                We Value Your Feedback
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Your questions and suggestions help us improve {siteConfig.name}
                . Whether you need technical support, have billing questions, or
                want to share feedback about our AI tools, we&apos;re here to
                listen and help.
              </p>
            </CardContent>
          </Card>
        </MotionDiv>
      </div>
    </div>
  );
};

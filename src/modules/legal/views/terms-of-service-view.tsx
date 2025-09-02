"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";

export const TermsOfServiceView = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 md:p-16">
            <div className="max-w-none">
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Terms of Service
                </h1>
                <div className="flex items-center justify-center text-gray-600 mb-6">
                  <span className="font-medium">Last updated: {siteConfig.legal.lastUpdated}</span>
                </div>
                <Separator className="w-24 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 h-1 rounded" />
              </div>

              {/* Content */}
              <div className="prose prose-base prose-slate max-w-none">
                {/* Section 1: Introduction */}
                <section id="1-introduction" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    1. Introduction
                  </h2>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    Welcome to {siteConfig.name} ("we," "us," "our," or the "Service"), an AI-powered platform that provides text-to-image, image-to-image, and text-to-video generation services. These Terms of Service ("Terms") govern your use of our Service.
                  </p>
                </section>

                {/* Section 2: Acceptance of Terms */}
                <section id="2-acceptance-of-terms" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    2. Acceptance of Terms
                  </h2>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access or use our Service.
                  </p>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    You must be at least 13 years old to use our Service. By using our Service, you represent and warrant that you are at least 13 years old.
                  </p>
                </section>

                {/* Section 3: Service Description */}
                <section id="3-service-description" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    3. Service Description
                  </h2>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    {siteConfig.name} provides AI-powered content generation services, including:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li><strong>Text-to-Image Generation:</strong> Create images from text descriptions</li>
                    <li><strong>Image-to-Image Generation:</strong> Transform existing images using AI</li>
                    <li><strong>Text-to-Video Generation:</strong> Generate videos from text prompts</li>
                    <li><strong>Content Management:</strong> Store, organize, and share your generated content</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    3.1 Service Plans
                  </h3>
                  <div className="mb-4">
                    <p className="text-gray-700 text-sm font-semibold mb-2">Free Plan:</p>
                    <ul className="list-disc list-inside space-y-1.5 mb-4 text-gray-700 text-sm ml-4">
                      <li>Access to all basic AI generation features</li>
                      <li>No usage restrictions on generation count</li>
                      <li>All generated content is publicly visible</li>
                    </ul>
                  </div>
                  <div className="mb-4">
                    <p className="text-gray-700 text-sm font-semibold mb-2">Paid Plans:</p>
                    <ul className="list-disc list-inside space-y-1.5 text-gray-700 text-sm ml-4">
                      <li>Monthly and annual subscription options</li>
                      <li>Credit-based system with fixed monthly credit allocation</li>
                      <li>Each generation consumes credits based on complexity and type</li>
                      <li>Private generation options available</li>
                      <li>Priority processing and enhanced features</li>
                    </ul>
                  </div>
                </section>

                {/* Section 4: User Accounts */}
                <section id="4-user-accounts" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    4. User Accounts
                  </h2>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    4.1 Account Creation
                  </h3>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>You can create an account by signing in with your Google account</li>
                    <li>You are responsible for maintaining the confidentiality of your account</li>
                    <li>You are responsible for all activities that occur under your account</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    4.2 Account Requirements
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 text-base leading-relaxed">
                    <li>Provide accurate and complete information</li>
                    <li>Maintain and update your account information</li>
                    <li>Notify us immediately of any unauthorized use of your account</li>
                  </ul>
                </section>

                {/* Section 5: Subscription Plans and Payment */}
                <section id="5-subscription-plans-and-payment" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    5. Subscription Plans and Payment
                  </h2>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    5.1 Billing
                  </h3>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>Subscriptions are billed monthly or annually in advance</li>
                    <li>Payment is processed through third-party providers (Stripe, PayPal, Creem)</li>
                    <li>All fees are non-refundable except as stated in our Refund Policy</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    5.2 Credit System
                  </h3>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>Paid plans include monthly credit allocations</li>
                    <li>Credits are consumed when generating content</li>
                    <li>Different content types may consume different credit amounts</li>
                    <li>Unused credits do not roll over to the next billing period</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    5.3 Auto-Renewal
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 text-base leading-relaxed">
                    <li>Subscriptions automatically renew unless cancelled</li>
                    <li>You may cancel your subscription at any time through your account settings</li>
                    <li>Cancellation takes effect at the end of the current billing period</li>
                  </ul>
                </section>

                {/* Section 6: Acceptable Use Policy */}
                <section id="6-acceptable-use-policy" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    6. Acceptable Use Policy
                  </h2>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    6.1 Prohibited Content
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    You agree not to use our Service to generate, upload, or share content that:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>Contains nudity, sexual content, or adult material</li>
                    <li>Depicts violence, gore, or graphic content</li>
                    <li>Infringes on intellectual property rights of others</li>
                    <li>Contains hate speech, harassment, or discriminatory content</li>
                    <li>Violates any applicable laws or regulations</li>
                    <li>Spreads misinformation or harmful content</li>
                    <li>Attempts to impersonate real individuals without consent</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    6.2 Prohibited Activities
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">You agree not to:</p>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>Use the Service for illegal purposes</li>
                    <li>Attempt to reverse engineer or copy our AI models</li>
                    <li>Engage in automated scraping or bulk downloading</li>
                    <li>Share account credentials with others</li>
                    <li>Interfere with or disrupt the Service</li>
                    <li>Use the Service to compete with us directly</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    6.3 Enforcement
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed">
                    We reserve the right to remove content and suspend or terminate accounts that violate these policies without prior notice.
                  </p>
                </section>

                {/* Section 7: Intellectual Property Rights */}
                <section id="7-intellectual-property-rights" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    7. Intellectual Property Rights
                  </h2>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    7.1 Service Ownership
                  </h3>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>We own all rights to the Service, including AI models, software, and technology</li>
                    <li>Our trademarks, logos, and brand elements are our exclusive property</li>
                    <li>These Terms do not grant you any rights to our intellectual property</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    7.2 AI Model Protections
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 text-base leading-relaxed">
                    <li>Our AI models and algorithms are proprietary and protected by intellectual property laws</li>
                    <li>You may not attempt to extract, reverse engineer, or replicate our models</li>
                  </ul>
                </section>

                {/* Section 8: User-Generated Content */}
                <section id="8-user-generated-content" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    8. User-Generated Content
                  </h2>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    8.1 Content Ownership
                  </h3>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>You retain ownership rights to content you generate using our Service</li>
                    <li>We do not claim ownership of your generated images or videos</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    8.2 License to Us
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">By using our Service, you grant us:</p>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>A worldwide, non-exclusive, royalty-free license to display your public content</li>
                    <li>The right to use public content for promotional and marketing purposes</li>
                    <li>The right to use aggregated, anonymized data to improve our Service</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    8.3 Public Display
                  </h3>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>All content generated on the free plan is publicly visible by default</li>
                    <li>Other users may view, share, and use your public content</li>
                    <li>You can generate private content with paid subscription plans</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    8.4 Commercial Use
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 text-base leading-relaxed">
                    <li>You are free to use generated content for commercial purposes</li>
                    <li>This includes selling, licensing, or monetizing your generated content</li>
                    <li>You are responsible for ensuring commercial use complies with applicable laws</li>
                  </ul>
                </section>

                {/* Section 9: Service Availability */}
                <section id="9-service-availability" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    9. Service Availability
                  </h2>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    9.1 Service Uptime
                  </h3>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>We strive to maintain high service availability</li>
                    <li>We do not guarantee uninterrupted or error-free service</li>
                    <li>Scheduled maintenance may temporarily interrupt service</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    9.2 Service Modifications
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 text-base leading-relaxed">
                    <li>We may modify, suspend, or discontinue features at any time</li>
                    <li>We will provide reasonable notice for significant changes when possible</li>
                    <li>No compensation is provided for service modifications or interruptions</li>
                  </ul>
                </section>

                {/* Section 10: Disclaimers */}
                <section id="10-disclaimers" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    10. Disclaimers
                  </h2>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    10.1 AI-Generated Content
                  </h3>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>AI-generated content may not always be accurate or appropriate</li>
                    <li>You are responsible for reviewing and verifying generated content before use</li>
                    <li>We make no warranties about the quality or suitability of generated content</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    10.2 Service Disclaimers
                  </h3>
                  <div className="bg-gray-50 border-l-4 border-gray-400 p-5 rounded-r-lg mb-5">
                    <p className="text-gray-700 text-sm mb-3 font-semibold">
                      THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 text-base leading-relaxed">
                      <li>Merchantability, fitness for a particular purpose, or non-infringement</li>
                      <li>Accuracy, reliability, or completeness of content</li>
                      <li>Uninterrupted or error-free operation</li>
                    </ul>
                  </div>
                </section>

                {/* Section 11: Limitation of Liability */}
                <section id="11-limitation-of-liability" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    11. Limitation of Liability
                  </h2>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    11.1 Liability Limits
                  </h3>
                  <div className="bg-gray-50 border-l-4 border-gray-400 p-5 rounded-r-lg mb-5">
                    <p className="text-gray-700 text-sm mb-3 font-semibold">
                      TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 text-base leading-relaxed">
                      <li>Any indirect, incidental, special, or consequential damages</li>
                      <li>Loss of profits, data, or business opportunities</li>
                      <li>Damages exceeding the amount paid by you in the 12 months preceding the claim</li>
                    </ul>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    11.2 Service Interruptions
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">We are not liable for:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 text-base leading-relaxed">
                    <li>Temporary service outages or maintenance</li>
                    <li>Third-party service provider failures</li>
                    <li>Force majeure events beyond our reasonable control</li>
                    <li>Issues caused by your internet connection or device problems</li>
                  </ul>
                </section>

                {/* Section 12: Termination */}
                <section id="12-termination" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    12. Termination
                  </h2>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    12.1 Termination by You
                  </h3>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>You may terminate your account at any time through account settings</li>
                    <li>Termination does not entitle you to a refund except as stated in our Refund Policy</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    12.2 Termination by Us
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">We may suspend or terminate your account if you:</p>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>Violate these Terms or our Acceptable Use Policy</li>
                    <li>Engage in fraudulent or illegal activities</li>
                    <li>Cause harm to our Service or other users</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    12.3 Effect of Termination
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">Upon termination:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 text-base leading-relaxed">
                    <li>Your access to the Service will cease</li>
                    <li>Public content may remain visible unless specifically removed</li>
                    <li>We may delete your account data after a reasonable period</li>
                  </ul>
                </section>

                {/* Section 13: Refund Policy */}
                <section id="13-refund-policy" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    13. Refund Policy
                  </h2>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    13.1 Refund Eligibility
                  </h3>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>Refunds are available within 30 days of purchase</li>
                    <li>Refunds are calculated based on unused credits/services on a pro-rata basis</li>
                    <li>No refunds for services already consumed or credits used</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    13.2 Refund Process
                  </h3>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>Request refunds by contacting {siteConfig.contact.email}</li>
                    <li>Include your account details and reason for refund</li>
                    <li>Refunds are processed within 5-10 business days to your original payment method</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    13.3 Exceptions
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">No refunds are available for:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 text-base leading-relaxed">
                    <li>Accounts terminated for Terms violations</li>
                    <li>Requests made after 30 days from purchase</li>
                    <li>Free plan usage (no payment involved)</li>
                  </ul>
                </section>

                {/* Section 14: Privacy */}
                <section id="14-privacy" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    14. Privacy
                  </h2>
                  <p className="text-gray-700 text-base leading-relaxed">
                    Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
                  </p>
                </section>

                {/* Section 15: Modifications to Terms */}
                <section id="15-modifications-to-terms" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    15. Modifications to Terms
                  </h2>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    15.1 Updates
                  </h3>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>We may update these Terms from time to time</li>
                    <li>Significant changes will be communicated via email or service notifications</li>
                    <li>Continued use of the Service constitutes acceptance of updated Terms</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    15.2 Notification
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 text-base leading-relaxed">
                    <li>Updated Terms will be posted with a new "Last updated" date</li>
                    <li>We encourage you to review Terms periodically</li>
                  </ul>
                </section>

                {/* Section 16: Dispute Resolution */}
                <section id="16-dispute-resolution" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    16. Dispute Resolution
                  </h2>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    16.1 Informal Resolution
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    Before pursuing formal dispute resolution, we encourage you to contact us at {siteConfig.contact.email} to seek an informal resolution.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    16.2 Binding Arbitration
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    If informal resolution fails, any disputes will be resolved through binding arbitration rather than in court, except where prohibited by law.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    16.3 Class Action Waiver
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed">
                    You agree to resolve disputes individually and waive any right to participate in class action lawsuits or class-wide arbitration.
                  </p>
                </section>

                {/* Section 17: General Provisions */}
                <section id="17-general-provisions" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    17. General Provisions
                  </h2>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    17.1 Entire Agreement
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    These Terms constitute the entire agreement between you and us regarding the Service.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    17.2 Severability
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    If any provision of these Terms is found unenforceable, the remaining provisions will remain in full force.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    17.3 Assignment
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    We may assign our rights and obligations under these Terms. You may not assign your rights without our written consent.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    17.4 Governing Law
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed">
                    These Terms are governed by the laws of the jurisdiction where our service operates, without regard to conflict of law principles.
                  </p>
                </section>

                {/* Section 18: Contact Information */}
                <section id="18-contact-information" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    18. Contact Information
                  </h2>
                  <p className="text-gray-700 text-sm mb-4">
                    If you have questions about these Terms, please contact us:
                  </p>
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <p className="text-gray-700 text-sm mb-2">
                      <strong>Email:</strong> {siteConfig.contact.email}
                    </p>
                    <p className="text-gray-700 text-base leading-relaxed">
                      <strong>Website:</strong> {siteConfig.url}
                    </p>
                  </div>
                </section>

                {/* Footer */}
                <Separator className="my-8" />
                <div className="text-center">
                  <p className="text-gray-600 text-sm italic">
                    These Terms of Service are effective as of the last updated date and will remain in effect until modified or terminated in accordance with the terms herein.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
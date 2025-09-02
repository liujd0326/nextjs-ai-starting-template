"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";

export const PrivacyPolicyView = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 md:p-16">
            <div className="max-w-none">
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Privacy Policy
                </h1>
                <div className="flex items-center justify-center text-gray-600 mb-6">
                  <span className="font-medium">
                    Last updated: {siteConfig.legal.lastUpdated}
                  </span>
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
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      Welcome to {siteConfig.name} (&quot;we,&quot;
                      &quot;our,&quot; or &quot;the Service&quot;). We are
                      committed to protecting your privacy and personal data.
                      This Privacy Policy explains how we collect, use, store,
                      and protect the information you provide when using our AI
                      image and video generation services.
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      By using our Service, you agree to the collection and use
                      of information in accordance with this Privacy Policy. If
                      you do not agree with this policy, please do not use our
                      Service.
                    </p>
                  </div>
                  <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-lg">
                    <div className="flex items-start">
                      <div>
                        <p className="font-semibold text-amber-800 text-sm mb-1">
                          Important Notice:
                        </p>
                        <p className="text-amber-700 text-sm">
                          Our Service is only available to users aged 13 and
                          above. If you are under 13 years old, please do not
                          use our Service or provide us with any personal
                          information.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 2: Information We Collect */}
                <section id="2-information-we-collect" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    2. Information We Collect
                  </h2>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    2.1 Information You Provide Directly
                  </h3>
                  <ul className="list-disc list-inside space-y-1.5 mb-5 text-gray-700 text-sm">
                    <li>
                      <strong>Google Account Information:</strong> When you sign
                      in through Google, we collect your email address, name,
                      and profile picture
                    </li>
                    <li>
                      <strong>User-Generated Content:</strong> Images you
                      upload, text prompts you enter, and content generated
                      through our AI services
                    </li>
                    <li>
                      <strong>Payment Information:</strong> Payment details
                      processed through third-party payment processors (Stripe,
                      PayPal, Creem, etc.)
                    </li>
                    <li>
                      <strong>Communication Information:</strong> Records of
                      your communications with our customer support team
                    </li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    2.2 Automatically Collected Information
                  </h3>
                  <ul className="list-disc list-inside space-y-1.5 text-gray-700 text-sm">
                    <li>
                      <strong>Usage Data:</strong> How you use our Service,
                      including feature usage frequency and types of content
                      generated
                    </li>
                    <li>
                      <strong>Device Information:</strong> Device type,
                      operating system, browser type, IP address, etc.
                    </li>
                    <li>
                      <strong>Cookies and Tracking Technologies:</strong> Used
                      to improve user experience and analyze Service usage
                    </li>
                    <li>
                      <strong>Analytics Data:</strong> Website visit and usage
                      statistics collected through Google Analytics and other
                      tools
                    </li>
                  </ul>
                </section>

                {/* Section 3: How We Use Your Information */}
                <section id="3-how-we-use-your-information" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    3. How We Use Your Information
                  </h2>
                  <p className="text-gray-700 text-sm mb-3">
                    We use the collected information for the following purposes:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 mb-5 text-gray-700 text-sm">
                    <li>
                      <strong>Provide Services:</strong> Process your AI
                      generation requests, manage your account, and provide
                      customer support
                    </li>
                    <li>
                      <strong>Improve Services:</strong> Analyze usage patterns
                      to optimize our AI models and user experience
                    </li>
                    <li>
                      <strong>Personalize Experience:</strong> Customize content
                      and features based on your preferences
                    </li>
                    <li>
                      <strong>Marketing Communications:</strong> Send service
                      updates, feature introductions, and promotional
                      information (you can unsubscribe at any time)
                    </li>
                    <li>
                      <strong>Security Protection:</strong> Detect and prevent
                      fraud, abuse, and other harmful activities
                    </li>
                    <li>
                      <strong>Legal Compliance:</strong> Comply with applicable
                      laws and regulations
                    </li>
                  </ul>
                  <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
                    <div className="flex items-start">
                      <div>
                        <p className="font-semibold text-green-800 text-sm mb-1">
                          Important Note:
                        </p>
                        <p className="text-green-700 text-sm">
                          We do <strong>NOT</strong> use your uploaded content
                          to train our AI models. Your creative content is only
                          used to provide services to you.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 4: Information Sharing */}
                <section id="4-information-sharing" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    4. Information Sharing
                  </h2>
                  <p className="text-gray-700 mb-6">
                    We respect your privacy and only share your information in
                    the following circumstances:
                  </p>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    4.1 Third-Party Service Providers
                  </h3>
                  <ul className="list-disc list-inside space-y-1.5 mb-5 text-gray-700 text-sm">
                    <li>
                      <strong>Payment Processing:</strong> Stripe, PayPal,
                      Creem, and other payment platforms process transactions
                    </li>
                    <li>
                      <strong>Cloud Storage:</strong> Neon database (US) stores
                      your account and usage data
                    </li>
                    <li>
                      <strong>Analytics Services:</strong> Google Analytics and
                      other tools help us analyze Service usage
                    </li>
                    <li>
                      <strong>Email Services:</strong> Third-party email service
                      providers send marketing and service emails
                    </li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    4.2 Public Content
                  </h3>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg mb-6">
                    <p className="text-blue-800 text-sm">
                      AI images and videos generated through our Service will be{" "}
                      <strong>publicly displayed</strong> and viewable by other
                      users. Please be mindful of this when generating content
                      and do not include personal sensitive information.
                    </p>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    4.3 Legal Requirements
                  </h3>
                  <p className="text-gray-700 text-sm">
                    We may disclose your information when required by law or to
                    protect our rights and user safety.
                  </p>
                </section>

                {/* Section 5: Data Security */}
                <section id="5-data-security" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    5. Data Security
                  </h2>
                  <p className="text-gray-700 text-sm mb-3">
                    We implement reasonable technical and organizational
                    measures to protect your personal information:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 mb-5 text-gray-700 text-sm">
                    <li>
                      Use encryption technology to protect data transmission and
                      storage
                    </li>
                    <li>
                      Implement access controls to limit employee access to
                      personal data
                    </li>
                    <li>
                      Regularly update security measures to address new threats
                    </li>
                    <li>Use secure third-party service providers</li>
                  </ul>
                  <p className="text-gray-600 text-sm italic">
                    However, please note that no method of data transmission or
                    storage is 100% secure. We cannot guarantee the absolute
                    security of your information.
                  </p>
                </section>

                {/* Section 6: Your Rights */}
                <section id="6-your-rights" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    6. Your Rights
                  </h2>
                  <p className="text-gray-700 text-sm mb-3">
                    Under applicable data protection laws (including GDPR), you
                    have the following rights:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 mb-5 text-gray-700 text-sm">
                    <li>
                      <strong>Right of Access:</strong> Request copies of your
                      personal data we hold
                    </li>
                    <li>
                      <strong>Right of Rectification:</strong> Request
                      correction of inaccurate or incomplete personal data
                    </li>
                    <li>
                      <strong>Right of Erasure:</strong> Request deletion of
                      your personal data (&quot;right to be forgotten&quot;)
                    </li>
                    <li>
                      <strong>Right to Restrict Processing:</strong> Restrict
                      our processing of your data in specific circumstances
                    </li>
                    <li>
                      <strong>Right to Data Portability:</strong> Obtain your
                      data in a structured, commonly used format
                    </li>
                    <li>
                      <strong>Right to Object:</strong> Object to our processing
                      of your data based on legitimate interests
                    </li>
                    <li>
                      <strong>Right to Withdraw Consent:</strong> Withdraw your
                      previously given consent at any time
                    </li>
                  </ul>
                  <p className="text-gray-700 text-sm">
                    To exercise these rights, please contact us at:{" "}
                    <strong>{siteConfig.contact.email}</strong>
                  </p>
                </section>

                {/* Section 7: Data Retention */}
                <section id="7-data-retention" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    7. Data Retention
                  </h2>
                  <p className="text-gray-700 text-sm mb-3">
                    We retain your personal data according to the following
                    principles:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 mb-5 text-gray-700 text-sm">
                    <li>
                      <strong>Account Data:</strong> Retained during your
                      account&apos;s existence and for a reasonable period after
                      deletion
                    </li>
                    <li>
                      <strong>Generated Content:</strong> Since content is
                      public, it will be retained long-term for community use
                    </li>
                    <li>
                      <strong>Usage Data:</strong> Used for analysis and service
                      improvement, typically retained for 2-3 years
                    </li>
                    <li>
                      <strong>Legal Requirements:</strong> Minimum retention
                      periods required by laws and regulations
                    </li>
                  </ul>
                  <p className="text-gray-700 text-sm">
                    When we no longer need your data, we will securely delete or
                    anonymize it.
                  </p>
                </section>

                {/* Section 8: Children's Privacy */}
                <section id="8-childrens-privacy" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    8. Children&apos;s Privacy
                  </h2>
                  <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-lg">
                    <p className="text-amber-800 text-sm mb-4">
                      <strong>
                        Our Service is not directed to children under 13 years
                        of age.
                      </strong>{" "}
                      We do not knowingly collect personal information from
                      children under 13. If we discover we have collected such
                      information, we will delete it immediately.
                    </p>
                    <p className="text-amber-800 text-sm">
                      If you are a parent or guardian and become aware that your
                      child has provided us with personal information, please
                      contact us, and we will take steps to remove such
                      information.
                    </p>
                  </div>
                </section>

                {/* Section 9: International Data Transfers */}
                <section id="9-international-data-transfers" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    9. International Data Transfers
                  </h2>
                  <p className="text-gray-700 text-sm mb-3">
                    Since we use cloud services located in the United States
                    (Neon database), your data may be transferred to the US for
                    processing and storage. We ensure:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 text-gray-700 text-sm">
                    <li>
                      Selection of service providers that comply with
                      international data protection standards
                    </li>
                    <li>
                      Implementation of appropriate data protection measures
                    </li>
                    <li>
                      Compliance with legal requirements for cross-border data
                      transfers
                    </li>
                  </ul>
                </section>

                {/* Section 10: Policy Changes */}
                <section id="10-policy-changes" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    10. Policy Changes
                  </h2>
                  <p className="text-gray-700 text-sm mb-3">
                    We may update this Privacy Policy from time to time. For
                    significant changes, we will:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 mb-5 text-gray-700 text-sm">
                    <li>Post notices in prominent locations on our website</li>
                    <li>Notify registered users via email</li>
                    <li>
                      Update the &quot;Last updated&quot; date at the top of
                      this page
                    </li>
                  </ul>
                  <p className="text-gray-700 text-sm">
                    Continued use of our Service constitutes acceptance of the
                    updated policy.
                  </p>
                </section>

                {/* Section 11: Contact Us */}
                <section id="11-contact-us" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    11. Contact Us
                  </h2>
                  <p className="text-gray-700 text-sm mb-3">
                    If you have any questions or concerns about this Privacy
                    Policy, please contact us:
                  </p>
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <p className="text-gray-700 text-sm mb-2">
                      <strong>Email:</strong> {siteConfig.contact.email}
                    </p>
                    <p className="text-gray-700 text-sm">
                      <strong>Website:</strong> {siteConfig.url}
                    </p>
                  </div>
                  <p className="text-gray-700 text-sm mt-4">
                    We will respond to your inquiries as soon as possible,
                    typically within {siteConfig.contact.supportResponseTime}.
                  </p>
                </section>

                {/* Footer */}
                <Separator className="my-8" />
                <div className="text-center">
                  <p className="text-gray-600 text-sm italic">
                    This Privacy Policy is designed to be transparent about our
                    data practices while ensuring compliance with applicable
                    privacy laws and regulations.
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

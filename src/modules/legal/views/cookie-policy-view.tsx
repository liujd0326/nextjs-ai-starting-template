"use client";

import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";

export const CookiePolicyView = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 md:p-16">
            <div className="max-w-none">
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Cookie Policy
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
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    This Cookie Policy explains how {siteConfig.name}{" "}
                    (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) uses
                    cookies and similar tracking technologies when you visit our
                    website at {siteConfig.url} (the &quot;Service&quot;). This
                    policy explains what these technologies are, why we use
                    them, and your rights to control our use of them.
                  </p>
                  <p className="text-gray-700 text-base leading-relaxed">
                    This Cookie Policy should be read together with our{" "}
                    <Link
                      href="/privacy-policy"
                      className="text-blue-600 hover:underline"
                    >
                      Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/terms-of-service"
                      className="text-blue-600 hover:underline"
                    >
                      Terms of Service
                    </Link>
                    .
                  </p>
                </section>

                {/* Section 2: What Are Cookies */}
                <section id="2-what-are-cookies" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    2. What Are Cookies
                  </h2>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    Cookies are small text files that are placed on your
                    computer or mobile device when you visit a website. They are
                    widely used to make websites work more efficiently and to
                    provide information to website owners.
                  </p>
                  <p className="text-gray-700 text-base leading-relaxed mb-5">
                    Cookies set by the website owner (in this case,{" "}
                    {siteConfig.name}) are called &quot;first-party
                    cookies.&quot; Cookies set by parties other than the website
                    owner are called &quot;third-party cookies.&quot;
                    Third-party cookies enable third-party features or
                    functionality to be provided on or through the website
                    (e.g., analytics, interactive content, and advertising).
                  </p>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Similar Technologies
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    We also use other tracking technologies similar to cookies,
                    including:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 text-base leading-relaxed">
                    <li>
                      <strong>Web beacons/pixels:</strong> Small graphic images
                      that help us analyze website usage
                    </li>
                    <li>
                      <strong>Local storage:</strong> Browser storage that
                      retains data locally on your device
                    </li>
                    <li>
                      <strong>Session storage:</strong> Temporary storage that
                      expires when you close your browser
                    </li>
                  </ul>
                </section>

                {/* Section 3: How We Use Cookies */}
                <section id="3-how-we-use-cookies" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    3. How We Use Cookies
                  </h2>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    We use cookies for the following purposes:
                  </p>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Essential Cookies
                  </h3>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>
                      <strong>Authentication:</strong> Remember your login
                      status and account information
                    </li>
                    <li>
                      <strong>Security:</strong> Protect against fraud and
                      unauthorized access
                    </li>
                    <li>
                      <strong>Functionality:</strong> Enable core features of
                      our Service to work properly
                    </li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Analytics Cookies
                  </h3>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>
                      <strong>Usage Analytics:</strong> Understand how visitors
                      interact with our Service
                    </li>
                    <li>
                      <strong>Performance Monitoring:</strong> Identify and fix
                      technical issues
                    </li>
                    <li>
                      <strong>User Behavior:</strong> Analyze user journeys and
                      improve user experience
                    </li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Preference Cookies
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 text-base leading-relaxed">
                    <li>
                      <strong>Settings:</strong> Remember your preferences and
                      customizations
                    </li>
                    <li>
                      <strong>Language:</strong> Store your preferred language
                      and region settings
                    </li>
                    <li>
                      <strong>Theme:</strong> Remember your chosen display
                      preferences
                    </li>
                  </ul>
                </section>

                {/* Section 4: Types of Cookies We Use */}
                <section id="4-types-of-cookies-we-use" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    4. Types of Cookies We Use
                  </h2>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    4.1 Session Cookies
                  </h3>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>
                      Temporary cookies that expire when you close your browser
                    </li>
                    <li>Essential for basic Service functionality</li>
                    <li>Not stored permanently on your device</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    4.2 Persistent Cookies
                  </h3>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>
                      Remain on your device for a set period or until manually
                      deleted
                    </li>
                    <li>Used to remember your preferences across visits</li>
                    <li>Help provide a more personalized experience</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    4.3 Strictly Necessary Cookies
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    These cookies are essential for our Service to function
                    properly:
                  </p>
                  <div className="bg-gray-50 p-5 rounded-lg mb-5">
                    <div className="overflow-x-auto">
                      <table className="w-full text-base">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 text-gray-800 font-semibold">
                              Cookie Name
                            </th>
                            <th className="text-left py-2 text-gray-800 font-semibold">
                              Purpose
                            </th>
                            <th className="text-left py-2 text-gray-800 font-semibold">
                              Duration
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-700 text-base leading-relaxed">
                          <tr className="border-b">
                            <td className="py-2 font-mono">auth_token</td>
                            <td className="py-2">
                              User authentication and session management
                            </td>
                            <td className="py-2">Session</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-mono">csrf_token</td>
                            <td className="py-2">
                              Security protection against cross-site request
                              forgery
                            </td>
                            <td className="py-2">Session</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-mono">session_id</td>
                            <td className="py-2">
                              Maintain user session across pages
                            </td>
                            <td className="py-2">Session</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    4.4 Performance and Analytics Cookies
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    These cookies help us understand how visitors use our
                    Service:
                  </p>
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <div className="overflow-x-auto">
                      <table className="w-full text-base">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 text-gray-800 font-semibold">
                              Service
                            </th>
                            <th className="text-left py-2 text-gray-800 font-semibold">
                              Purpose
                            </th>
                            <th className="text-left py-2 text-gray-800 font-semibold">
                              Duration
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-700 text-base leading-relaxed">
                          <tr className="border-b">
                            <td className="py-2 font-semibold">
                              Google Analytics
                            </td>
                            <td className="py-2">
                              Website traffic and user behavior analysis
                            </td>
                            <td className="py-2">2 years</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-semibold">
                              Microsoft Clarity
                            </td>
                            <td className="py-2">
                              User session recording and heatmap analysis
                            </td>
                            <td className="py-2">1 year</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-semibold">OpenPanel</td>
                            <td className="py-2">
                              Privacy-focused analytics and user insights
                            </td>
                            <td className="py-2">1 year</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-semibold">Plausible</td>
                            <td className="py-2">
                              Lightweight analytics without personal data
                              collection
                            </td>
                            <td className="py-2">1 year</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-semibold">Umami</td>
                            <td className="py-2">
                              Simple, privacy-friendly website analytics
                            </td>
                            <td className="py-2">1 year</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>

                {/* Section 5: Third-Party Cookies */}
                <section id="5-third-party-cookies" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    5. Third-Party Cookies
                  </h2>
                  <p className="text-gray-700 text-base leading-relaxed mb-5">
                    We use several third-party analytics services that may set
                    their own cookies:
                  </p>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    5.1 Google Analytics
                  </h3>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>
                      <strong>Purpose:</strong> Comprehensive website analytics
                      and user behavior tracking
                    </li>
                    <li>
                      <strong>Data Collected:</strong> Page views, session
                      duration, user interactions, demographic information
                    </li>
                    <li>
                      <strong>Privacy Controls:</strong> You can opt-out using{" "}
                      <a
                        href="https://tools.google.com/dlpage/gaoptout"
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Google Analytics Opt-out Browser Add-on
                      </a>
                    </li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    5.2 Microsoft Clarity
                  </h3>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>
                      <strong>Purpose:</strong> User session recording and
                      website heatmaps
                    </li>
                    <li>
                      <strong>Data Collected:</strong> Mouse movements, clicks,
                      scrolling behavior, page interactions
                    </li>
                    <li>
                      <strong>Privacy:</strong> Data is anonymized and
                      aggregated
                    </li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    5.3 OpenPanel
                  </h3>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>
                      <strong>Purpose:</strong> Privacy-focused analytics
                      platform
                    </li>
                    <li>
                      <strong>Data Collected:</strong> Page views, referrers,
                      basic user interactions
                    </li>
                    <li>
                      <strong>Privacy:</strong> Designed with privacy-first
                      principles
                    </li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    5.4 Plausible Analytics
                  </h3>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>
                      <strong>Purpose:</strong> Simple, privacy-friendly website
                      analytics
                    </li>
                    <li>
                      <strong>Data Collected:</strong> Page views, traffic
                      sources, basic engagement metrics
                    </li>
                    <li>
                      <strong>Privacy:</strong> No personal data collection,
                      GDPR compliant
                    </li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    5.5 Umami
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 text-base leading-relaxed">
                    <li>
                      <strong>Purpose:</strong> Lightweight, open-source web
                      analytics
                    </li>
                    <li>
                      <strong>Data Collected:</strong> Basic website usage
                      statistics
                    </li>
                    <li>
                      <strong>Privacy:</strong> No personal identifiers,
                      privacy-focused design
                    </li>
                  </ul>
                </section>

                {/* Section 6: Your Cookie Choices */}
                <section id="6-your-cookie-choices" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    6. Your Cookie Choices
                  </h2>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    6.1 Cookie Consent
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    When you first visit our website, we may display a cookie
                    consent banner that allows you to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>Accept all cookies</li>
                    <li>Reject non-essential cookies</li>
                    <li>Customize your cookie preferences</li>
                    <li>Learn more about our cookie usage</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    6.2 Granular Control
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    You can control different types of cookies:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>
                      <strong>Strictly Necessary:</strong> Cannot be disabled as
                      they are essential for Service functionality
                    </li>
                    <li>
                      <strong>Performance/Analytics:</strong> Can be disabled,
                      but may limit our ability to improve the Service
                    </li>
                    <li>
                      <strong>Functional:</strong> Can be disabled, but may
                      affect your user experience
                    </li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    6.3 Updating Preferences
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    You can change your cookie preferences at any time by:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 text-base leading-relaxed">
                    <li>
                      Visiting our Cookie Preference Center (if available)
                    </li>
                    <li>
                      Clearing your browser cookies and revisiting our site
                    </li>
                    <li>Contacting us at {siteConfig.contact.email}</li>
                  </ul>
                </section>

                {/* Section 7: Managing Cookies */}
                <section id="7-managing-cookies" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    7. Managing Cookies
                  </h2>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    7.1 Browser Settings
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    You can control cookies through your browser settings:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>
                      <strong>Chrome:</strong> Settings &gt; Privacy and
                      Security &gt; Cookies and other site data
                    </li>
                    <li>
                      <strong>Firefox:</strong> Settings &gt; Privacy &amp;
                      Security &gt; Cookies and Site Data
                    </li>
                    <li>
                      <strong>Safari:</strong> Preferences &gt; Privacy &gt;
                      Manage Website Data
                    </li>
                    <li>
                      <strong>Edge:</strong> Settings &gt; Cookies and site
                      permissions
                    </li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    7.2 Mobile Devices
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed mb-5">
                    For mobile browsers, cookie management options are typically
                    found in the browser&apos;s privacy or security settings.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    7.3 Opt-Out Tools
                  </h3>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>
                      <strong>Google Analytics:</strong>{" "}
                      <a
                        href="https://tools.google.com/dlpage/gaoptout"
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Google Analytics Opt-out
                      </a>
                    </li>
                    <li>
                      <strong>Industry Opt-out:</strong>{" "}
                      <a
                        href="http://www.networkadvertising.org/choices/"
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Network Advertising Initiative
                      </a>
                    </li>
                    <li>
                      <strong>Your Online Choices:</strong>{" "}
                      <a
                        href="http://www.youronlinechoices.eu/"
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        European opt-out
                      </a>
                    </li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    7.4 Do Not Track
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed">
                    Some browsers offer &quot;Do Not Track&quot; signals. While
                    we respect user privacy preferences, there is no universal
                    standard for interpreting these signals, so we may not
                    automatically respond to them.
                  </p>
                </section>

                {/* Section 8: Updates to This Policy */}
                <section id="8-updates-to-this-policy" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    8. Updates to This Policy
                  </h2>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    We may update this Cookie Policy from time to time to
                    reflect changes in:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>The cookies we use</li>
                    <li>Legal requirements</li>
                    <li>Our business practices</li>
                    <li>Technology improvements</li>
                  </ul>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    When we make significant changes, we will:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>
                      Update the &quot;Last updated&quot; date at the top of
                      this policy
                    </li>
                    <li>Notify you through our Service or via email</li>
                    <li>Request renewed consent if required by law</li>
                  </ul>
                  <p className="text-gray-700 text-base leading-relaxed">
                    We encourage you to review this Cookie Policy periodically
                    to stay informed about our use of cookies.
                  </p>
                </section>

                {/* Section 9: Contact Us */}
                <section id="9-contact-us" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    9. Contact Us
                  </h2>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    If you have any questions about our use of cookies or this
                    Cookie Policy, please contact us:
                  </p>
                  <div className="bg-gray-50 p-5 rounded-lg mb-4">
                    <p className="text-gray-700 text-sm mb-2">
                      <strong>Email:</strong> {siteConfig.contact.email}
                    </p>
                    <p className="text-gray-700 text-base leading-relaxed">
                      <strong>Website:</strong> {siteConfig.url}
                    </p>
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed">
                    For specific privacy concerns or to exercise your rights
                    regarding cookies and personal data, please refer to our{" "}
                    <Link
                      href="/privacy"
                      className="text-blue-600 hover:underline"
                    >
                      Privacy Policy
                    </Link>{" "}
                    or contact us using the information above.
                  </p>
                </section>

                {/* Quick Reference Section */}
                <section className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    Quick Reference: Cookie Summary
                  </h2>
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <div className="overflow-x-auto">
                      <table className="w-full text-base">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 text-gray-800 font-semibold">
                              Category
                            </th>
                            <th className="text-left py-2 text-gray-800 font-semibold">
                              Essential
                            </th>
                            <th className="text-left py-2 text-gray-800 font-semibold">
                              Analytics
                            </th>
                            <th className="text-left py-2 text-gray-800 font-semibold">
                              Functional
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-700 text-base leading-relaxed">
                          <tr className="border-b">
                            <td className="py-2 font-semibold">Purpose</td>
                            <td className="py-2">Service functionality</td>
                            <td className="py-2">Usage analysis</td>
                            <td className="py-2">User preferences</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-semibold">Required</td>
                            <td className="py-2">Yes</td>
                            <td className="py-2">No</td>
                            <td className="py-2">No</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-semibold">
                              Can be disabled
                            </td>
                            <td className="py-2">No</td>
                            <td className="py-2">Yes</td>
                            <td className="py-2">Yes</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-semibold">
                              Third-party services
                            </td>
                            <td className="py-2">None</td>
                            <td className="py-2">
                              Google Analytics, Clarity, OpenPanel, Plausible,
                              Umami
                            </td>
                            <td className="py-2">None currently</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>

                {/* Footer */}
                <Separator className="my-8" />
                <div className="text-center">
                  <p className="text-gray-600 text-sm italic">
                    This Cookie Policy is designed to provide transparency about
                    our cookie usage while ensuring compliance with applicable
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

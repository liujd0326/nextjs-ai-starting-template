"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";

export const DmcaPolicyView = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 md:p-16">
            <div className="max-w-none">
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  DMCA Policy
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
                {/* Section 1: Overview */}
                <section id="1-overview" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    1. Overview
                  </h2>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
                    <p className="text-gray-700 text-base leading-relaxed mb-4">
                      {siteConfig.name} respects the intellectual property
                      rights of others and expects users of our service to do
                      the same. In accordance with the Digital Millennium
                      Copyright Act (&quot;DMCA&quot;) and other applicable
                      copyright laws, we have adopted a policy of terminating,
                      in appropriate circumstances and at our sole discretion,
                      users who are deemed to be repeat infringers.
                    </p>
                    <p className="text-gray-700 text-base leading-relaxed">
                      This DMCA Policy describes the procedures for reporting
                      copyright infringement on our AI image generation platform
                      and our process for responding to such claims.
                    </p>
                  </div>
                </section>

                {/* Section 2: Reporting Copyright Infringement */}
                <section
                  id="2-reporting-copyright-infringement"
                  className="mb-10"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    2. Reporting Copyright Infringement
                  </h2>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    If you believe that content available on or through our
                    Service infringes your copyright, you may send a DMCA
                    takedown notice to our designated copyright agent. Your
                    notice must comply with the DMCA and include the following
                    information:
                  </p>

                  <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg mb-6">
                    <h3 className="font-semibold text-red-800 text-base mb-3">
                      Required Information for Valid DMCA Notice:
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-red-700 text-sm">
                      <li>
                        A physical or electronic signature of the copyright
                        owner or authorized agent
                      </li>
                      <li>
                        Identification of the copyrighted work claimed to have
                        been infringed
                      </li>
                      <li>
                        Identification of the allegedly infringing material and
                        information reasonably sufficient to permit us to locate
                        the material
                      </li>
                      <li>
                        Your contact information, including address, telephone
                        number, and email address
                      </li>
                      <li>
                        A statement that you have a good faith belief that the
                        disputed use is not authorized by the copyright owner,
                        agent, or law
                      </li>
                      <li>
                        A statement, made under penalty of perjury, that the
                        information in your notice is accurate and that you are
                        authorized to act on behalf of the copyright owner
                      </li>
                    </ul>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    DMCA Notice Template
                  </h3>
                  <div className="bg-gray-100 p-6 rounded-lg font-mono text-sm mb-6">
                    <p className="mb-2">
                      <strong>To:</strong> DMCA Agent, {siteConfig.name}
                    </p>
                    <p className="mb-2">
                      <strong>Email:</strong> {siteConfig.contact.email}
                    </p>
                    <p className="mb-4">
                      <strong>Subject:</strong> DMCA Takedown Notice
                    </p>
                    <p className="mb-2">
                      I am the owner (or authorized agent of the owner) of
                      certain intellectual property rights in the work described
                      below.
                    </p>
                    <p className="mb-2">
                      I have a good faith belief that the use of this material
                      in the manner complained of is not authorized by the
                      copyright owner, its agent, or the law.
                    </p>
                    <p className="mb-2">
                      The information in this notification is accurate, and
                      under penalty of perjury, I am authorized to act on behalf
                      of the owner of an exclusive right that is allegedly
                      infringed.
                    </p>
                    <p className="mb-4">
                      Please remove or disable access to the following material:
                    </p>
                    <p className="mb-2">
                      - <em>Description of copyrighted work:</em>{" "}
                      _______________
                    </p>
                    <p className="mb-2">
                      - <em>URL or location of infringing content:</em>{" "}
                      _______________
                    </p>
                    <p className="mb-2">
                      - <em>Your contact information:</em> _______________
                    </p>
                    <p className="mb-2">Signature: _______________</p>
                    <p>Date: _______________</p>
                  </div>
                </section>

                {/* Section 3: Designated Agent */}
                <section id="3-designated-agent" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    3. Designated Copyright Agent
                  </h2>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    DMCA notices should be sent to our designated copyright
                    agent:
                  </p>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
                    <p className="text-blue-800 text-base mb-2">
                      <strong>DMCA Agent</strong>
                      <br />
                      {siteConfig.name}
                      <br />
                      Email: {siteConfig.contact.email}
                      <br />
                      Subject Line: &quot;DMCA Takedown Notice&quot;
                    </p>
                    <p className="text-blue-700 text-sm mt-4">
                      <strong>Note:</strong> We only accept DMCA notices via
                      email. Please ensure your notice includes all required
                      information listed above.
                    </p>
                  </div>
                </section>

                {/* Section 4: Response Procedure */}
                <section id="4-response-procedure" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    4. Our Response Procedure
                  </h2>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    Upon receipt of a valid DMCA takedown notice, we will:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>
                      Remove or disable access to the allegedly infringing
                      material
                    </li>
                    <li>
                      Notify the user who posted the content about the removal
                    </li>
                    <li>Provide the user with a copy of the takedown notice</li>
                    <li>
                      Inform the user of their right to file a
                      counter-notification
                    </li>
                  </ol>
                  <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
                    <p className="text-green-800 text-sm">
                      <strong>Response Time:</strong> We aim to process valid
                      DMCA takedown notices within 24-48 hours of receipt.
                    </p>
                  </div>
                </section>

                {/* Section 5: Counter-Notification */}
                <section id="5-counter-notification" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    5. Counter-Notification Procedure
                  </h2>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    If you believe your content was removed or disabled by
                    mistake or misidentification, you may file a
                    counter-notification. Your counter-notification must
                    include:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>Your physical or electronic signature</li>
                    <li>
                      Identification of the material and its location before
                      removal
                    </li>
                    <li>
                      A statement under penalty of perjury that you have a good
                      faith belief the material was removed by mistake
                    </li>
                    <li>Your name, address, and phone number</li>
                    <li>
                      A statement that you consent to jurisdiction of federal
                      court in your district
                    </li>
                    <li>
                      A statement that you will accept service of process from
                      the person who filed the original takedown notice
                    </li>
                  </ul>
                  <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-lg">
                    <p className="text-amber-800 text-sm">
                      <strong>Restoration Process:</strong> If we receive a
                      valid counter-notification, we may restore the content
                      within 10-14 business days unless the copyright owner
                      files a court action seeking a restraining order.
                    </p>
                  </div>
                </section>

                {/* Section 6: Repeat Infringer Policy */}
                <section id="6-repeat-infringer-policy" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    6. Repeat Infringer Policy
                  </h2>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    We have a policy of terminating, in appropriate
                    circumstances, users who are repeat infringers. We consider
                    the following when determining repeat infringer status:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>
                      Multiple valid DMCA takedown notices against the same user
                    </li>
                    <li>
                      A pattern of uploading content that infringes copyright
                    </li>
                    <li>
                      Failure to respond appropriately to takedown notices
                    </li>
                    <li>
                      Continued posting of infringing content after warnings
                    </li>
                  </ul>
                  <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">
                    <p className="text-red-800 text-sm">
                      <strong>Account Termination:</strong> Users identified as
                      repeat infringers may have their accounts terminated
                      without prior notice. We reserve the right to terminate
                      accounts at our sole discretion.
                    </p>
                  </div>
                </section>

                {/* Section 7: False Claims */}
                <section id="7-false-claims" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    7. False Claims and Misrepresentation
                  </h2>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    The DMCA provides for legal consequences for those who make
                    false claims:
                  </p>
                  <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg mb-6">
                    <p className="text-red-800 text-sm mb-3">
                      <strong>Warning:</strong> Making false statements in a
                      DMCA notice or counter-notification may result in
                      liability for damages, including costs and attorney fees.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-red-700 text-sm">
                      <li>Filing a false DMCA takedown notice is perjury</li>
                      <li>
                        Bad faith claims may result in liability for damages
                      </li>
                      <li>
                        We may pursue legal action against those who abuse the
                        DMCA process
                      </li>
                    </ul>
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed">
                    Please ensure you have a good faith belief that your
                    copyright has been infringed before filing a takedown
                    notice.
                  </p>
                </section>

                {/* Section 8: AI-Generated Content */}
                <section id="8-ai-generated-content" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    8. AI-Generated Content Considerations
                  </h2>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    As an AI image generation platform, we want to clarify our
                    position on AI-generated content and copyright:
                  </p>
                  <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-r-lg mb-6">
                    <ul className="list-disc list-inside space-y-2 text-purple-800 text-sm">
                      <li>
                        <strong>User Responsibility:</strong> Users are
                        responsible for ensuring their input prompts and
                        uploaded images do not infringe existing copyrights
                      </li>
                      <li>
                        <strong>AI Training Data:</strong> Our AI models are
                        trained on legally obtained data, but users should not
                        attempt to recreate copyrighted works
                      </li>
                      <li>
                        <strong>Generated Content:</strong> While AI-generated
                        images may not be directly copyrightable, they should
                        not intentionally copy or closely mimic existing
                        copyrighted works
                      </li>
                      <li>
                        <strong>Fair Use:</strong> The creation of AI art may
                        involve fair use considerations, which we evaluate on a
                        case-by-case basis
                      </li>
                    </ul>
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed">
                    We encourage users to create original content and respect
                    the intellectual property rights of others when using our AI
                    generation tools.
                  </p>
                </section>

                {/* Section 9: Limitation of Liability */}
                <section id="9-limitation-of-liability" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    9. Limitation of Liability
                  </h2>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    We are not responsible for:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 text-base leading-relaxed">
                    <li>Determining the validity of copyright claims</li>
                    <li>
                      Mediating disputes between copyright owners and users
                    </li>
                    <li>
                      The content of user-generated materials before publication
                    </li>
                    <li>
                      Any damages resulting from the removal or restoration of
                      content
                    </li>
                  </ul>
                  <p className="text-gray-700 text-base leading-relaxed">
                    Our role is limited to processing valid DMCA notices and
                    responding according to legal requirements.
                  </p>
                </section>

                {/* Section 10: Contact Information */}
                <section id="10-contact-information" className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    10. Contact Information
                  </h2>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    For DMCA-related questions or to submit notices, please
                    contact:
                  </p>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="text-gray-800 text-base mb-2">
                      <strong>DMCA Agent</strong>
                      <br />
                      {siteConfig.name}
                      <br />
                      Email: {siteConfig.contact.email}
                      <br />
                      Website: {siteConfig.url}
                    </p>
                    <p className="text-gray-600 text-sm mt-4">
                      <strong>Important:</strong> This email address is
                      specifically for DMCA notices. For general support
                      inquiries, please use our regular contact channels.
                    </p>
                  </div>
                </section>

                {/* Footer */}
                <Separator className="my-8" />
                <div className="text-center">
                  <p className="text-gray-600 text-sm italic">
                    This DMCA Policy is designed to comply with the Digital
                    Millennium Copyright Act and protect both copyright owners
                    and our users&apos; rights.
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

import { DmcaPolicyView } from "@/modules/legal/views/dmca-policy-view";

export const metadata = {
  title: "DMCA Policy - AI Template",
  description: "Digital Millennium Copyright Act (DMCA) policy and copyright infringement procedures for AI Template.",
};

export default function DmcaPage() {
  return <DmcaPolicyView />;
}
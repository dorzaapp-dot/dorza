import PillarPage from "@/components/sections/PillarPage";
import { getPillar } from "@/lib/data/pillars";
import { pageMetadata } from "@/lib/site";

const pillar = getPillar("support");

export const metadata = pageMetadata({
  title: pillar.metaTitle,
  description: pillar.metaDescription,
  path: "/support",
});

export default function SupportPage() {
  return <PillarPage slug="support" />;
}

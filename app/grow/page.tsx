import PillarPage from "@/components/sections/PillarPage";
import { getPillar } from "@/lib/data/pillars";
import { pageMetadata } from "@/lib/site";

const pillar = getPillar("grow");

export const metadata = pageMetadata({
  title: pillar.metaTitle,
  description: pillar.metaDescription,
  path: "/grow",
});

export default function GrowPage() {
  return <PillarPage slug="grow" />;
}

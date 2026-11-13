import PillarPage from "@/components/sections/PillarPage";
import { getPillar } from "@/lib/data/pillars";
import { pageMetadata } from "@/lib/site";

const pillar = getPillar("start");

export const metadata = pageMetadata({
  title: pillar.metaTitle,
  description: pillar.metaDescription,
  path: "/start",
});

export default function StartPage() {
  return <PillarPage slug="start" />;
}

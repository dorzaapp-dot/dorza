import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import SegmentMarquee from "@/components/sections/SegmentMarquee";
import Services from "@/components/sections/Services";
import HowItWorks from "@/components/sections/HowItWorks";
import Thesis from "@/components/sections/Thesis";
import SocialProof from "@/components/sections/SocialProof";
import Pricing from "@/components/sections/Pricing";
import TooGoodToBeTrue from "@/components/sections/TooGoodToBeTrue";
import FAQ from "@/components/sections/FAQ";
import FreeAudit from "@/components/sections/FreeAudit";
import WaitlistCTA from "@/components/sections/WaitlistCTA";
import Footer from "@/components/sections/Footer";
import SectionDivider from "@/components/ui/SectionDivider";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <SegmentMarquee />
        <Services />
        <SectionDivider fill="#FFFFFF" />
        <HowItWorks />
        <SectionDivider fill="#FDFAF7" />
        <Thesis />
        <SocialProof />
        <SectionDivider fill="#FFFFFF" />
        <Pricing />
        <SectionDivider fill="#FDFAF7" />
        <TooGoodToBeTrue />
        <FAQ />
        <SectionDivider fill="#FFFFFF" />
        <FreeAudit />
        <SectionDivider fill="#1A1A2E" />
        <WaitlistCTA />
      </main>
      <Footer />
    </>
  );
}

import Nav from "@/components/sections/Nav";
import HomeHero from "@/components/sections/home/HomeHero";
import HomeJourney from "@/components/sections/home/HomeJourney";
import HomeHowWeWork from "@/components/sections/home/HomeHowWeWork";
import HomePricing from "@/components/sections/home/HomePricing";
import FAQ from "@/components/sections/FAQ";
import WaitlistCTA from "@/components/sections/WaitlistCTA";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <HomeHero />
        <HomeJourney />
        <HomeHowWeWork />
        <HomePricing />
        <FAQ />
        <WaitlistCTA />
      </main>
      <Footer />
    </>
  );
}

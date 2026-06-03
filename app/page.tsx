import Hero from "@/components/homepage/hero";
import ProblemSection from "@/components/homepage/problem-section";
import HowItWorks from "@/components/homepage/how-it-works";
import ExamplePreview from "@/components/homepage/example-preview";
import FounderNote from "@/components/homepage/founder-note";
import FinalCta from "@/components/homepage/final-cta";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <ProblemSection />
        <HowItWorks />
        <ExamplePreview />
        <FounderNote />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}

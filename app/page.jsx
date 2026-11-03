import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AdsBanner from '@/components/AdsBanner';
import HowItWorks from '@/components/HowItWorks';
import Trending from '@/components/Trending';
import FeaturedProducts from '@/components/FeaturedProducts';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import Testimonials from '@/components/Testimonials';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeaturedProducts />
      <AdsBanner />
      <HowItWorks />
      <Trending />
      <Testimonials />
      <AboutSection />
      <ContactSection />
      <Footer />
      <FloatingWhatsApp /> 
    </>
  );
}
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MarqueeTicker from "@/components/MarqueeTicker";
import FirstHelloSection from "@/components/FirstHelloSection";
import EventLanesSection from "@/components/EventLanesSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import WhyRadhaSection from "@/components/WhyRadhaSection";
import QuoteSection from "@/components/QuoteSection";
import VideoSection from "@/components/VideoSection";
import EditorialPhilosophy from "@/components/EditorialPhilosophy";
import GallerySection from "@/components/GallerySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import InlineMediaKit from "@/components/InlineMediaKit";
import InlinePDFKit from "@/components/InlinePDFKit";
import BookingSection from "@/components/BookingSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SmartBookingChat from "@/components/SmartBookingChat";
import DigitalTwinSection from "@/components/DigitalTwinSection";
import { useState, useEffect } from 'react';
import KineticBooking from '../components/KineticBooking';
import ShadowRoom from '../components/ShadowRoom';

export default function Index() {
  const [showShadowRoom, setShowShadowRoom] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <Navbar />
      <HeroSection />
      <MarqueeTicker />
      <FirstHelloSection />
      <EventLanesSection />
      <AboutSection />
      <ServicesSection />
      <VideoSection />
      <EditorialPhilosophy />
      <DigitalTwinSection />
      <GallerySection />
      <WhyRadhaSection />
      <QuoteSection />
      <TestimonialsSection />
      <InlineMediaKit />
      <InlinePDFKit />
      {/* Infused KineticBooking section */}
      <section className="text-center py-32 bg-[#030303] border-t border-[#C9A84C]/20">
        <h2 className="text-4xl font-serif mb-12 text-[#C9A84C]">Drag to Secure Your Date</h2>
        <KineticBooking />
        <button className="mt-8 px-6 py-3 bg-[#C9A84C] text-[#030303] uppercase tracking-widest text-xs font-bold hover:bg-[#F5F0E8] transition-colors" onClick={() => setShowShadowRoom(true)}>
          Access Intelligence Matrix
        </button>
      </section>
      {/* Embedded ShadowRoom modal */}
      {showShadowRoom && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center animate-in fade-in zoom-in-95 duration-200">
          <ShadowRoom onExit={() => setShowShadowRoom(false)} />
        </div>
      )}
      <BookingSection />
      <Footer />
      <WhatsAppButton />
      <SmartBookingChat />
    </>
  );
}

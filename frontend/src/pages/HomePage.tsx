import { MembersSection } from '../features/members/components/MembersSection';
import { GigsSection } from '../features/gigs/components/GigSection';
import { HeroSection } from '../components/sections/HeroSection';
import { MusicSection } from '../features/songs/components/MusicSection';
import { FooterSection } from '../components/sections/FooterSection';
import { AboutSection } from '../features/about/components/AboutSection';
import { BookingSection } from '../features/booking/components/BookingSection';
import { SubscribeSection } from '../features/subscribers/components/SubscribeSection';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ShopCarousel } from '../features/shop/components/ShopCarousel';

export function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash]);

  return (
    <>
      <section id="hem">
        <HeroSection />
      </section>

      <section id="om">
        <AboutSection />
      </section>

      <section id="nyhetsbrev">
        <SubscribeSection />
      </section>

      <section id="boka">
        <BookingSection />
      </section>

      <section id="spelningar">
        <GigsSection />
      </section>

      <section id="bandet">
        <MembersSection />
      </section>

      <section id="musik">
         <MusicSection />
      </section>

      <section id="shop">
        <ShopCarousel />
      </section>

      <FooterSection />
    </>
  );
}
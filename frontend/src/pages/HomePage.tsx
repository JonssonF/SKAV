import { MembersSection } from '../features/members/components/MembersSection';
import { GigsSection } from '../features/gigs/components/GigSection';
import { HeroSection } from '../components/sections/HeroSection';
import { MusicSection } from '../features/songs/components/MusicSection';
import { FooterSection } from '../components/sections/FooterSection';
import { AboutSection } from '../features/about/components/AboutSection';
import { BookingSection } from '../features/booking/components/BookingSection';
import { SubscribeSection } from '../features/subscribers/components/SubscribeSection';
import { VotingSection } from '../features/songProposals/components/VotingSection';
import { ShopCarousel } from '../features/shop/components/ShopCarousel';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLocalStorage } from '@mantine/hooks';

const sectionStyle: React.CSSProperties = {
  position: 'relative',
};

function DecorationImage({
  src,
  side,
}: {
  src: string;
  side: 'left' | 'right';
}) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 0,
        overflow: 'visible',
        pointerEvents: 'none',
      }}
    >
      <motion.img
        src={src}
        alt=""
        initial={{ opacity: 0, x: side === 'left' ? -100 : 100 }}
        whileInView={{ opacity: 0.5, x: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          [side]: 0,
          top: '-150px',
          width: 'min(1000px, 40vw)',
          zIndex: -1,
          display: 'var(--decoration-display)',
        }}
      />
    </div>
  );
}

export function HomePage() {
  const location = useLocation();

  const [colorScheme] = useLocalStorage<'light' | 'dark'>({
  key: 'color-scheme',
  defaultValue: 'dark',
  });

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
      <section id="hem" style={sectionStyle}>
        <HeroSection />
      </section>

      <section id="om" style={sectionStyle}>
        <AboutSection />
      </section>

      {colorScheme === 'light' && (
        <DecorationImage src="/images/sections/left-light.png" side="left" />
      )}

      <section id="nyhetsbrev" style={sectionStyle}>
        <SubscribeSection />
      </section>

      {colorScheme === 'light' && (
        <DecorationImage src="/images/sections/right-light.png" side="right" />
      )}

      <section id="boka" style={sectionStyle}>
        <BookingSection />
      </section>

      {colorScheme === 'light' && (
        <DecorationImage src="/images/sections/left1-light.png" side="left" />
      )}

      <section id="spelningar" style={sectionStyle}>
        <GigsSection />
      </section>

      {colorScheme === 'light' && (
        <DecorationImage src="/images/sections/right1-light.png" side="right" />
      )}

      <section id="bandet" style={sectionStyle}>
        <MembersSection />
      </section>

      {colorScheme === 'light' && (
        <DecorationImage src="/images/sections/left2-light.png" side="left" />
      )}

      <section id="rösta" style={sectionStyle}>
        <VotingSection />
      </section>

      {colorScheme === 'light' && (
        <DecorationImage src="/images/sections/right2-light.png" side="right" />
      )}

      <section id="musik" style={sectionStyle}>
        <MusicSection />
      </section>
      
      {colorScheme === 'light' && (
        <DecorationImage src="/images/sections/left3-light.png" side="left" />
      )}

      <section id="shop" style={sectionStyle}>
        <ShopCarousel />
      </section>

      <FooterSection />
    </>
  );
}
import { MembersSection } from '../features/members/components/MembersSection';
import { GigsSection } from '../features/gigs/components/GigSection';
import { HeroSection } from '../components/sections/HeroSection';
import { MusicSection } from '../features/songs/components/MusicSection';
import { FooterSection } from '../components/sections/FooterSection';
import { AboutSection } from '../features/about/components/AboutSection';

export function HomePage() {
  return (
    <>
      <section id="hem">
        <HeroSection />
      </section>

      <section id="om">
        <AboutSection />
      </section>

      <section id="bandet">
        <MembersSection />
      </section>

      <section id="spelningar">
        <GigsSection />
      </section>

      <section id="musik">
         <MusicSection />
      </section>

      <FooterSection />
    </>
  );
}
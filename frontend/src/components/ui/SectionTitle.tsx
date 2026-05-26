import { motion } from 'framer-motion';

const sentence = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const letter = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, damping: 12 },
  },
};

interface SectionTitleProps {
  text: string;
  mb?: string;
}

export function SectionTitle({ text, mb = 'lg' }: SectionTitleProps) {
  return (
    <motion.div
      variants={sentence}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: `var(--mantine-spacing-${mb})`,
      }}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={letter}
          style={{
            display: 'inline-block',
            fontFamily: "'Permanent Marker', cursive",
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            whiteSpace: char === ' ' ? 'pre' : 'normal',
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
}
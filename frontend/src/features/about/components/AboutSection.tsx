import {
  Container,
  Text,
  Stack,
  Paper,
} from '@mantine/core';
import { motion } from 'framer-motion';
import { SectionTitle } from '../../../components/ui/SectionTitle';

const paragraphs = [
  'Ca 233km söder om Bengtsfors håller Byns bästa band till.',
  'SKAV är bandet som stavas som det låter, och låter som det ska.',
  'När sex män med enorma egon och noll självdistans träffas händer magiska ting.',
  'Pappret på att vi är mentalt stabila är signerat och inramat på väggen.',
  'Vår musik är till stor del inspirerad av livet i byn, men också ganska mycket av sånt vi läst om på text-TV.',
];

export function AboutSection() {
  return (
    <Container size="md" py="xl">
      <Stack gap="xl" align="center">
        <SectionTitle text="Om Oss" />

        <Paper
          radius="lg"
          p="xl"
          style={{
            background: 'var(--mantine-color-default-hover)',
            maxWidth: 700,
            width: '100%',
          }}
        >
          <Stack gap="lg">
            {paragraphs.map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: 'easeOut',
                }}
              >
                <Text
                  size="lg"
                  ta="center"
                  style={{
                    fontFamily: "'Caveat', cursive",
                    fontSize: i === 0 || i === paragraphs.length - 1
                      ? 'clamp(1.4rem, 3vw, 1.8rem)'
                      : 'clamp(1.2rem, 2.5vw, 1.5rem)',
                    lineHeight: 1.6,
                    fontWeight: i === 2 ? 700 : 500,
                  }}
                >
                  {text}
                </Text>
              </motion.div>
            ))}
          </Stack>
        </Paper>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Text
            size="sm"
            c="dimmed"
            ta="center"
            fs="italic"
            style={{ fontFamily: "'Caveat', cursive", fontSize: '1.1rem' }}
          >
            — Derome, sen 2019 —
          </Text>
        </motion.div>
      </Stack>
    </Container>
  );
}
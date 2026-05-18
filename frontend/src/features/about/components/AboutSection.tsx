import {
  Container,
  Title,
  Text,
  Stack,
} from '@mantine/core';

export function AboutSection() {
  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="lg" ta="center">Om Oss</Title>
      <Stack gap="md">
        <Text>
        Ca 233km söder om Bengtsfors håller Byns bästa band till. SKAV är bandet som stavas som det låter,
        och låter som det ska. När sex män med enorma egon och noll självdistans träffas händer magiska ting. 
        Pappret på att vi är mentalt stabila är signerat och inramat på väggen. Vår musik är till stor del inspirerad av livet i byn, 
        men också ganska mycket av sånt vi läst om på text-TV.
        </Text>
      </Stack>
    </Container>
  );
}
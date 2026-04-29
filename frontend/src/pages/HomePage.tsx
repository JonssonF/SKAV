import { Container, Title, Text } from '@mantine/core';

export function HomePage() {
  return (
    <Container py="xl">
      <Title order={1}>SKAV</Title>
      <Text c="dimmed" mt="md">Välkommen till SKAVs hemsida 🎸</Text>
    </Container>
  );
}
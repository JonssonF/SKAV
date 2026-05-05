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
          SKAV är ett punkband från Byn i Åre, bildat 2016. Vi spelar snabb och energisk punkrock med texter som ofta handlar om livet i en liten by, 
          kärlek, och att våga vara sig själv. Vi har släppt två album och flera singlar, och vi älskar att spela live så ofta vi kan!
        </Text>
      </Stack>
    </Container>
  );
}